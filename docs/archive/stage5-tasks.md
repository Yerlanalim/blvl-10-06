# Stage 5: Access Control & Payment Stub - Detailed Tasks

## Overview
**Goal**: Завершить AI интеграцию, усилить контроль доступа и создать заглушку для платежей
**Timeline**: День 9-10 (примерно 15 часов работы)
**Prerequisite**: Stage 4 завершен, AI чат работает через Vertex AI

## Анализ текущего состояния

### Что сделано в Stage 4:
- ✅ Vertex AI интеграция работает (gemini-2.0-flash-001)
- ✅ Rate limiting реализован и протестирован
- ✅ UI чата полностью функционален
- ✅ Контекст минимален и оптимален
- ⚠️ Manual testing не завершен
- ⚠️ Error Boundary для чата не добавлен

### Изменения в плане:
- ❌ Убираем Paddle полностью
- ✅ Создаем заглушку для будущих платежных систем
- ✅ Тестовые аккаунты вместо реальных платежей

---

## Task 5.0: Complete Stage 4 (2 часа)

### Цель
Завершить оставшиеся задачи из Stage 4

### Подзадача 5.0.1: Error Boundary для чата
**Файлы для изменения**:
- `src/app/(app)/chat/page.tsx` - обернуть ChatInterface

**Логика**:
1. Импортировать существующий ErrorBoundary
2. Обернуть ChatInterface компонент
3. Настроить fallback UI с сообщением об ошибке
4. Добавить кнопку "Try Again" для перезагрузки

### Подзадача 5.0.2: Manual Testing
**Действия**:
1. Пройти все пункты из stage4-final-test-manifest.md
2. Документировать результаты в новом файле test-results.md
3. Создать issues для найденных проблем
4. Исправить критические баги

**Чек-лист ключевых проверок**:
- [ ] Free user: 30 сообщений total
- [ ] Paid user: 30 сообщений в день с reset
- [ ] Streaming работает плавно
- [ ] Контекст передается корректно
- [ ] Ошибки обрабатываются gracefully

### Подзадача 5.0.3: Простое кеширование 
**Файлы для создания**:
- `src/lib/ai/cache.ts` - простой кеш для частых вопросов

**Логика**:
```typescript
// Структура кеша
{
  question: string,
  answer: string,
  timestamp: number,
  ttl: 3600000 // 1 час
}
```

**Важно**:
- Использовать localStorage
- Максимум 20 записей
- Очищать старые при превышении
- Только для идентичных вопросов

---

## Task 5.1: Tier System Setup (3 часа)

### Цель
Формализовать систему тарифов и централизовать проверки

### Файлы для создания
- `src/lib/tiers/config.ts` - конфигурация тарифов
- `src/lib/tiers/access.ts` - функции проверки доступа
- `src/lib/hooks/useTierAccess.ts` - хук для компонентов

### Файлы для изменения
- `src/lib/types.ts` - добавить типы для тарифов

### Логика реализации

#### 1. Конфигурация тарифов (config.ts)
```typescript
// Структура конфигурации
TIERS = {
  free: {
    name: 'Free',
    maxLevels: 3,
    aiMessagesTotal: 30,
    aiMessagesDaily: null,
    features: ['basic_content', 'community']
  },
  paid: {
    name: 'Premium',
    maxLevels: 10,
    aiMessagesTotal: null,
    aiMessagesDaily: 30,
    features: ['all_content', 'ai_assistant', 'certificates']
  }
}
```

#### 2. Функции доступа (access.ts)
- `canAccessLevel(userId, levelId)` - проверка доступа к уровню
- `canSendAIMessage(userId)` - проверка лимита AI
- `getTierLimits(tierType)` - получить лимиты тарифа
- `hasFeature(userId, feature)` - проверка фичи

#### 3. Хук useTierAccess
- Обертка над функциями доступа
- Кеширование результатов
- Realtime обновления при смене тарифа

### Важно
- Централизованная логика (DRY)
- Использовать в существующих компонентах
- Заменить разрозненные проверки

---

## Task 5.2: Level Access Control (2 часа)

### Цель
Усилить контроль доступа на всех уровнях приложения

### Файлы для изменения
- `src/components/level/LevelCard.tsx` - использовать useTierAccess
- `src/app/(app)/lesson/[id]/page.tsx` - проверка на сервере
- `src/middleware.ts` - добавить проверку для /lesson/*

### Логика реализации

#### 1. Frontend проверки
- Заменить прямые проверки на useTierAccess
- Показывать четкие сообщения о блокировке
- Добавить визуальные индикаторы (замок, badge "Premium")

#### 2. Backend проверки
- Server-side проверка в lesson/[id]/page.tsx
- Если нет доступа - redirect на /levels с toast
- Логировать попытки несанкционированного доступа

#### 3. Middleware защита
- Добавить проверку tier для маршрутов /lesson/*
- Кешировать результаты проверки
- Быстрый bypass для authorized requests

### UI улучшения
- Показывать "Upgrade to Premium" вместо простого замка
- Preview первых минут видео для заблокированных уровней
- Счетчик "2 levels remaining in Free tier"

---

## Task 5.3: Remove Paddle & Create Payment Stub (4 часа)

### Цель
Удалить Paddle интеграцию и создать гибкую заглушку для будущих платежных систем

### Файлы для удаления
- Все файлы связанные с Paddle
- Paddle-specific компоненты
- Paddle webhooks и API routes

### Файлы для создания
- `src/lib/payments/interface.ts` - абстрактный интерфейс
- `src/lib/payments/stub.ts` - заглушка реализация
- `src/app/(app)/upgrade/page.tsx` - страница апгрейда

### Файлы для изменения
- `src/components/HomePricing.tsx` - убрать Paddle логику
- `.env.local` - удалить Paddle переменные

### Логика реализации

#### 1. Абстрактный интерфейс платежей
```typescript
// interface.ts
type PaymentProvider = {
  createCheckout(userId: string, tier: string): Promise<CheckoutSession>
  cancelSubscription(userId: string): Promise<void>
  getSubscriptionStatus(userId: string): Promise<SubscriptionStatus>
}
```

#### 2. Stub реализация
- Простые async функции возвращающие success
- Логирование вызовов для отладки
- Изменение tier_type в user_profiles напрямую

#### 3. Тестовые аккаунты
Создать через Supabase:
- `test-free@bizlevel.com` - всегда free tier
- `test-premium@bizlevel.com` - всегда paid tier
- Документировать в README

#### 4. UI страница апгрейда
- Простая страница с benefits сравнением
- Кнопка "Upgrade" показывает toast "Payment system coming soon"
- Для тестов - переключатель tier в dev mode

### Важно
- Сохранить структуру для легкой интеграции
- Не усложнять заглушку
- Четкая документация для будущего

---

## Task 5.4: Email Notifications (3 часа)

### Цель
Настроить email уведомления без привязки к платежам

### Файлы для создания
- `src/lib/email/templates/welcome.ts`
- `src/lib/email/templates/level-complete.ts` 
- `src/lib/email/send.ts` - функция отправки

### Интеграция
- Использовать Supabase Edge Functions
- Или Resend API если проще

### Типы уведомлений
1. **Welcome email** - при регистрации
2. **Level completed** - при завершении уровня
3. **Weekly progress** - сводка активности
4. **AI quota reminder** - когда осталось < 5 сообщений

### Логика реализации
1. HTML templates с простым дизайном
2. Triggered by database events или API calls
3. Unsubscribe link в каждом письме
4. Логирование отправок

### Важно
- Использовать существующие email сервисы
- Простые шаблоны без сложной верстки
- Обязательный unsubscribe

---

## Task 5.5: Stage 5 Testing & Refactor (3 часа)

### Цель
Финальная проверка системы доступа и интеграций

### Тесты для написания

#### 1. Тесты контроля доступа
- Free user видит только 3 уровня
- Paid user видит все 10 уровней
- Middleware блокирует прямые URLs
- Server-side проверки работают

#### 2. Тесты заглушки платежей
- Интерфейс корректно имплементирован
- Тестовые аккаунты работают
- UI показывает правильные сообщения

#### 3. E2E сценарии
- Полный flow от регистрации до урока
- Проверка всех ограничений
- Email уведомления отправляются

### Рефакторинг
- Удалить все упоминания Paddle
- Унифицировать проверки доступа
- Оптимизировать повторяющийся код
- Добавить JSDoc комментарии

### Security аудит
- Проверить все endpoints на авторизацию
- Валидация входных данных
- RLS политики актуальны
- Нет обхода ограничений

### Документация
- Обновить README с тестовыми аккаунтами
- Документировать payment stub API
- Создать migration guide от Paddle
- Обновить status.md

### Чек-лист финальной проверки
- [ ] Stage 4 полностью завершен
- [ ] Manual testing пройден
- [ ] Paddle полностью удален
- [ ] Payment stub работает
- [ ] Тестовые аккаунты созданы
- [ ] Tier система централизована
- [ ] Access control усилен
- [ ] Email уведомления работают
- [ ] Документация обновлена
- [ ] Нет регрессий

---

## Ожидаемый результат Stage 5

1. ✅ AI чат полностью протестирован и стабилен
2. ✅ Система тарифов централизована и надежна
3. ✅ Контроль доступа работает на всех уровнях
4. ✅ Paddle удален, есть гибкая заглушка
5. ✅ Email уведомления повышают engagement
6. ✅ Проект готов к добавлению любой платежной системы

## Ключевые изменения от оригинального плана

- ❌ **Убрали**: Paddle интеграцию полностью
- ✅ **Добавили**: Payment stub для гибкости
- ✅ **Добавили**: Тестовые аккаунты для демо
- ✅ **Усилили**: Централизованный контроль доступа
- ✅ **Упростили**: Платежи на будущее