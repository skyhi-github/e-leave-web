<template>
  <div class="chat-widget" :class="{ open: isOpen }" aria-live="polite">
    <!-- Collapsed floating button -->
    <div v-if="showLauncher" class="chat-fab-wrap">
      <v-btn
        class="chat-fab"
        color="primary"
        size="large"
        icon
        elevation="10"
        @click="open()"
        aria-label="Open chat"
      >
        <v-icon>mdi-chat</v-icon>
      </v-btn>

      <span class="chat-fab-dots" aria-hidden="true">
        <span class="chat-fab-dot" />
        <span class="chat-fab-dot" />
        <span class="chat-fab-dot" />
      </span>
    </div>

    <!-- Expanded chat panel -->
    <transition name="chat-pop" @after-leave="onAfterLeave">
      <v-card v-if="isOpen" class="chat-panel" elevation="12">
        <v-toolbar density="comfortable" color="primary" class="chat-toolbar">
          <v-avatar size="36" class="ml-2 mr-1" rounded="circle">
            <v-img :src="aiIcon" alt="AI" />
          </v-avatar>
          <v-toolbar-title class="text-subtitle-1 ml-0 pl-0">AI Chat</v-toolbar-title>
          <v-spacer />
          <v-btn variant="text" icon @click="close()" aria-label="Close chat">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <div ref="messagesEl" class="chat-messages">
          <div
            v-for="m in messages"
            :key="m.id"
            class="msg"
            :class="m.role"
          >
            <div class="bubble">{{ m.text }}</div>
          </div>
        </div>

        <v-divider />

        <div class="chat-footer">
          <div v-if="showSamples" class="chat-samples">
            <div class="samples-title">Quick questions:</div>
            <div class="samples-list">
              <v-chip
                v-for="q in sampleQuestions"
                :key="q"
                class="sample-chip"
                color="primary"
                variant="tonal"
                size="small"
                clickable
                @click="send(q)"
              >
                {{ q }}
              </v-chip>
            </div>
          </div>

          <div class="chat-input">
            <v-text-field
              v-model="draft"
              density="comfortable"
              variant="outlined"
              hide-details
              placeholder="Type a message…"
              @keyup.enter="send()"
            />
            <v-btn
              color="primary"
              prepend-icon="mdi-send-circle"
              class="ml-2"
              @click="send()"
              :disabled="!draft.trim()"
            >
              Send
            </v-btn>
          </div>
        </div>
      </v-card>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref } from 'vue'
import aiIcon from '@/assets/ai.jpg'

type Role = 'user' | 'bot'

interface ChatMessage {
  id: string
  role: Role
  text: string
}

const isOpen = ref(false)
const showLauncher = ref(true)
const draft = ref('')
const messagesEl = ref<HTMLElement | null>(null)

const welcomeFullText = 'Hi! How can I help you today?'
const welcomeTyped = ref(false)

let typingTimer: number | undefined

const messages = ref<ChatMessage[]>([
  { id: 'welcome', role: 'bot', text: '' },
])

const sampleQuestions = [
  'what time I scan in today?',
  'how many annual leave I have?',
]

const showSamples = computed(() => messages.value.every((m) => m.role !== 'user'))

function open() {
  showLauncher.value = false
  isOpen.value = true
  nextTick(() => {
    if (!welcomeTyped.value) {
      const welcomeMsg = messages.value.find((m) => m.id === 'welcome')
      if (welcomeMsg) {
        typeIntoMessage(welcomeMsg, welcomeFullText)
        welcomeTyped.value = true
      }
    }
    scrollToBottom()
  })
}

function close() {
  stopTyping()
  isOpen.value = false

  // Reset so opening the chat starts the typing animation again.
  welcomeTyped.value = false
  draft.value = ''
  messages.value = [{ id: 'welcome', role: 'bot', text: '' }]
}

function onAfterLeave() {
  showLauncher.value = true
}

function scrollToBottom() {
  const el = messagesEl.value
  if (!el) return
  el.scrollTop = el.scrollHeight
}

function stopTyping() {
  if (typingTimer) window.clearInterval(typingTimer)
  typingTimer = undefined
}

function typeIntoMessage(message: ChatMessage, fullText: string) {
  stopTyping()

  message.text = ''
  let i = 0

  // Slightly variable cadence to feel more "GPT-like".
  typingTimer = window.setInterval(() => {
    const step = Math.random() < 0.12 ? 2 : 1
    i = Math.min(fullText.length, i + step)
    message.text = fullText.slice(0, i)
    scrollToBottom()

    if (i >= fullText.length) {
      stopTyping()
    }
  }, 18)
}

function send(textOverride?: string) {
  const text = (textOverride ?? draft.value).trim()
  if (!text) return

  messages.value.push({
    id: `${Date.now()}-u`,
    role: 'user',
    text,
  })

  // Tiny local bot stub (no backend call yet) with "GPT-like" typing.
  const botMsg: ChatMessage = {
    id: `${Date.now()}-b`,
    role: 'bot',
    text: '',
  }
  messages.value.push(botMsg)
  nextTick(() => typeIntoMessage(botMsg, `You said: ${text}`))

  draft.value = ''
  nextTick(() => scrollToBottom())
}

onBeforeUnmount(() => {
  stopTyping()
})
</script>

<style scoped>
.chat-widget {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 2147483000; /* safely on top of most app overlays */
}

.chat-fab {
  border-radius: 999px;
}

.chat-fab-wrap {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
}

.chat-fab-dots {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  margin-top: 8px;
}

.chat-fab-dot {
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: rgb(var(--v-theme-success));
  opacity: 0.35;
  transform: translateY(0);
  animation: chatDotBounce 900ms ease-in-out infinite;
}

.chat-fab-dot:nth-child(1) {
  animation-delay: 0ms;
}

.chat-fab-dot:nth-child(2) {
  animation-delay: 150ms;
}

.chat-fab-dot:nth-child(3) {
  animation-delay: 300ms;
}

@keyframes chatDotBounce {
  0% {
    opacity: 0.35;
    transform: translateY(0);
  }
  30% {
    opacity: 1;
    transform: translateY(-3px);
  }
  60% {
    opacity: 0.6;
    transform: translateY(0);
  }
  100% {
    opacity: 0.35;
    transform: translateY(0);
  }
}

.chat-panel {
  width: min(360px, calc(100vw - 40px));
  height: min(520px, calc(100vh - 40px));
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.chat-toolbar {
  color: white;
}

.chat-messages {
  padding: 12px;
  flex: 1;
  overflow-y: auto;
  background: #f6f7fb;
}

.chat-samples {
  padding: 10px 12px;
  border-bottom: 1px solid rgba(17, 24, 39, 0.08);
  background: #ffffff;
}

.samples-title {
  font-size: 0.8rem;
  opacity: 0.8;
  margin-bottom: 8px;
}

.samples-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.sample-chip {
  cursor: pointer;
}

.msg {
  display: flex;
  margin: 8px 0;
}

.msg.user {
  justify-content: flex-end;
}

.msg.bot {
  justify-content: flex-start;
}

.bubble {
  max-width: 80%;
  padding: 10px 12px;
  border-radius: 14px;
  line-height: 1.25;
  font-size: 0.95rem;
  white-space: pre-wrap;
  word-break: break-word;
}

.msg.user .bubble {
  background: #1976d2;
  color: #fff;
  border-bottom-right-radius: 6px;
}

.msg.bot .bubble {
  background: #ffffff;
  color: #111827;
  border: 1px solid rgba(17, 24, 39, 0.08);
  border-bottom-left-radius: 6px;
}

.chat-input {
  display: flex;
  gap: 8px;
  padding: 12px;
  align-items: center;
  background: #ffffff;
}

.chat-footer {
  display: flex;
  flex-direction: column;
}

/* Transition: transforms from bottom-right into panel */
.chat-pop-enter-active,
.chat-pop-leave-active {
  transform-origin: bottom right;
}

.chat-pop-enter-active {
  transition: transform 220ms cubic-bezier(0.2, 0.9, 0.2, 1), opacity 220ms ease;
}

.chat-pop-leave-active {
  transition: transform 260ms cubic-bezier(0.4, 0, 0.2, 1), opacity 200ms ease;
}

.chat-pop-enter-from,
.chat-pop-leave-to {
  opacity: 0;
  transform: translate(10px, 10px) scale(0.15);
}

.chat-pop-enter-to,
.chat-pop-leave-from {
  opacity: 1;
  transform: translate(0, 0) scale(1);
}
</style>
