# Stage 4: AI Integration - Detailed Tasks

## Overview
**Goal**: Интегрировать AI ассистента "Leo" с минимальным контекстом через Vertex AI
**Timeline**: День 7-8 (примерно 16 часов работы)
**Prerequisite**: Stage 3 завершен, артефакты работают, прогресс отслеживается

## Анализ текущего состояния

### Что у нас есть:
- ✅ Система прогресса полностью функциональна
- ✅ user_profiles уже содержит поля: ai_messages_count, ai_daily_reset_at
- ✅ Навигация с пунктом "AI Assistant" готова
- ✅ Все необходимые данные о прогрессе доступны

### Извлеченные уроки из предыдущих этапов:
- Важность SSR проверок (typeof window)
- Оптимизация с useCallback критична
- Type alias предпочтительнее пустых интерфейсов
- Single query лучше множественных запросов
- Правильная cleanup для подписок

---

## Task 4.1: Vertex AI Setup (2 часа)

### Цель
Настроить подключение к Vertex AI через Google Cloud

### Файлы для создания
- `src/lib/ai/vertex.ts` - конфигурация Vertex AI
- `src/lib/ai/types.ts` - типы для AI интеграции

### Файлы для изменения
- `.env.local` - добавить credentials

### Переменные окружения для добавления
```
GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account.json
VERTEX_AI_PROJECT_ID=your-project-id
VERTEX_AI_LOCATION=us-central1
VERTEX_AI_MODEL=gemini-1.5-flash
```

### Логика реализации
1. **vertex.ts должен**:
   - Инициализировать Vertex AI клиент
   - Использовать service account для аутентификации
   - Экспортировать функцию для создания chat сессии
   - Обрабатывать ошибки подключения

2. **types.ts должен содержать**:
   - ChatMessage тип (role, content)
   - ChatContext тип (level, step, tier)
   - ChatResponse тип
   - Использовать type вместо interface (урок из Stage 3)

3. **Конфигурация**:
   - Model: gemini-1.5-flash (оптимальный для чата)
   - Temperature: 0.7 (баланс креативности)
   - Max tokens: 1024 (достаточно для ответов)
   - Safety settings: умеренные

### Важно
- НЕ хардкодить credentials
- Использовать try-catch для всех операций
- Логировать ошибки для отладки

---

## Task 4.2: Chat API Route (3 часа)

### Цель
Создать streaming endpoint для общения с AI

### Файлы для создания
- `src/app/api/chat/route.ts` - API endpoint

### Логика реализации
1. **Проверка авторизации**:
   - Получить user из Supabase auth
   - Если нет - вернуть 401
   - Получить user_profile для проверки лимитов

2. **Rate limiting**:
   - Проверить ai_messages_count vs tier_type
   - Free: max 30 total (без сброса)
   - Paid: max 30/день (сбрасывается в ai_daily_reset_at)
   - Вернуть 429 если превышен лимит

3. **Контекст для AI**:
   - Получить текущий прогресс пользователя
   - Создать минимальный контекст: {currentLevel, currentStep, tierType}
   - НЕ передавать весь контент урока (модель предобучена)

4. **Streaming ответа**:
   - Использовать Vercel AI SDK StreamingTextResponse
   - Или fallback на Server-Sent Events если проблемы
   - Обработать прерывание соединения

5. **Обновление счетчика**:
   - INCREMENT ai_messages_count после успешного ответа
   - Для paid: проверить и обновить ai_daily_reset_at если нужно
   - Использовать транзакцию для атомарности

### Обработка ошибок
- 401 - не авторизован
- 429 - превышен лимит
- 500 - ошибка Vertex AI
- Логировать все ошибки

### Важно
- Учесть SSR (проверки на сервере)
- Минимальный контекст для экономии токенов
- Правильная обработка streaming

---

## Task 4.3: Message Counter (2 часа)

### Цель
Создать систему отслеживания лимитов сообщений

### Файлы для создания
- `src/lib/hooks/useAIQuota.ts` - хук для работы с квотой

### Логика реализации
1. **useAIQuota должен**:
   - Получать текущий ai_messages_count
   - Вычислять оставшиеся сообщения based on tier
   - Проверять нужен ли сброс для paid users
   - Возвращать: {used, remaining, canSend, resetAt}
   - Подписаться на realtime обновления

2. **Логика сброса для paid**:
   - Если ai_daily_reset_at < now() - сбросить
   - Установить новый ai_daily_reset_at = now() + 24h
   - Обнулить ai_messages_count
   - Выполнить в транзакции

3. **Расчет оставшихся**:
   ```
   if (tier === 'free') {
     remaining = Math.max(0, 30 - used)
   } else {
     // paid
     if (needsReset) resetQuota()
     remaining = Math.max(0, 30 - used)
   }
   ```

### Оптимизация (уроки из Stage 3)
- useCallback для функций
- Правильная cleanup подписок
- Избегать лишних re-renders

### Важно
- Атомарные операции с БД
- Корректная работа с временными зонами
- Realtime обновление UI

---

## Task 4.4: Chat UI Creation (4 часа)

### Цель
Создать интерфейс чата с AI ассистентом

### Файлы для создания
- `src/app/(app)/chat/page.tsx` - страница чата
- `src/components/chat/ChatInterface.tsx` - основной компонент
- `src/components/chat/MessageList.tsx` - список сообщений
- `src/components/chat/MessageInput.tsx` - поле ввода
- `src/components/chat/QuotaDisplay.tsx` - индикатор квоты

### Логика реализации
1. **ChatInterface**:
   - Управляет состоянием сообщений (local state)
   - Вызывает API endpoint при отправке
   - Показывает streaming ответы
   - Использует существующий layout
   - НЕ сохраняет историю между сессиями

2. **MessageList**:
   - Использует существующие компоненты списков
   - Различает user и assistant сообщения
   - Показывает "Leo is typing..." при streaming
   - Auto-scroll к последнему сообщению
   - Использовать существующие стили для сообщений

3. **MessageInput**:
   - Использует существующий Input из ui/
   - Кнопка отправки (существующий Button)
   - Блокируется во время отправки
   - Очищается после отправки
   - Enter для отправки

4. **QuotaDisplay**:
   - Использует useAIQuota хук
   - Показывает: "3/30 messages today" или "27/30 messages total"
   - Использует существующий Progress компонент
   - Обновляется в realtime

### UI структура
```
Leo - AI Assistant
[QuotaDisplay: 3/30 messages today]

[MessageList]
User: How do I create a business plan?
Leo: Based on Level 1 content...
User: Thanks!
Leo is typing...

[MessageInput] [Send Button]
```

### Важно
- Максимально использовать существующие компоненты
- НЕ создавать сложный state management
- Простой и понятный UI

---

## Task 4.5: Context Integration (2 часа)

### Цель
Интегрировать прогресс пользователя в контекст AI

### Файлы для создания
- `src/lib/ai/context.ts` - построение контекста
- `src/lib/ai/prompts.ts` - системные промпты

### Логика реализации
1. **context.ts должен**:
   - Принимать userId
   - Получать данные через useUserProgress (или прямой запрос)
   - Возвращать минимальный контекст:
     ```
     {
       currentLevel: 3,
       currentLevelTitle: "Financial Planning",
       currentStep: "video",
       completedLevels: [1, 2],
       tierType: "paid"
     }
     ```
   - НЕ включать весь контент уроков

2. **prompts.ts должен содержать**:
   - Системный промпт для Leo
   - Включать: роль (образовательный ассистент)
   - Ссылку на предобученные знания
   - Инструкции по тону (дружелюбный, поддерживающий)
   - Ограничения (не раскрывать ответы тестов)

3. **Интеграция в API route**:
   - Получить контекст перед отправкой в Vertex AI
   - Добавить к системному промпту
   - Кешировать контекст на время сессии

### Пример системного промпта
```
You are Leo, a friendly AI assistant for BizLevel educational platform.
You have been trained on all 10 business levels content.
Current user context: {context}
Help users understand concepts, but don't give away test answers.
Be encouraging and supportive.
```

### Важно
- Минимальный контекст для экономии токенов
- Полагаться на предобучение модели
- Четкие инструкции в промпте

---

## Task 4.6: Stage 4 Testing & Refactor (3 часа)

### Цель
Проверить работу AI интеграции и оптимизировать

### Тесты для написания
1. **E2E тест чата**:
   - Авторизоваться как free user
   - Отправить сообщение
   - Получить ответ
   - Проверить декремент квоты
   - Достичь лимита (упрощенный тест)

2. **API тесты**:
   - Rate limiting работает
   - Контекст правильно формируется
   - Streaming не ломается
   - Ошибки обрабатываются

3. **Интеграционные тесты**:
   - useAIQuota правильно считает
   - Сброс для paid users работает
   - Realtime обновления квоты

### Оптимизации (уроки предыдущих этапов)
- useCallback для всех функций в компонентах
- Проверки window для client-only кода
- Правильная cleanup для streaming
- Оптимальные запросы к БД

### Load testing
- Проверить работу при множественных запросах
- Убедиться что rate limiting работает
- Проверить производительность streaming

### Обновление документации
- Обновить status.md
- Документировать AI endpoints
- Добавить примеры использования

### Чек-лист для проверки
- [ ] Vertex AI подключен и работает
- [ ] Streaming ответы отображаются
- [ ] Rate limiting для free users (30 total)
- [ ] Rate limiting для paid users (30/day)
- [ ] Сброс счетчика для paid работает
- [ ] Контекст правильно передается
- [ ] UI отзывчивый и понятный
- [ ] Ошибки обрабатываются gracefully
- [ ] Производительность приемлемая

---

## Потенциальные проблемы и решения

### 1. Streaming в Next.js App Router
- **Проблема**: Известные issues с буферизацией
- **Решение**: Использовать Vercel AI SDK или SSE fallback
- **Тестировать**: На реальном deployment (не только localhost)

### 2. Превышение лимитов Vertex AI
- **Проблема**: Rate limits на API
- **Решение**: Добавить retry с exponential backoff
- **Мониторинг**: Логировать все 429 ошибки

### 3. Контекст и токены
- **Проблема**: Большой контекст = высокие затраты
- **Решение**: Минимальный контекст + предобучение
- **Оптимизация**: Кешировать частые вопросы

### 4. Временные зоны для reset
- **Проблема**: Разные часовые пояса пользователей
- **Решение**: Использовать UTC для всех расчетов
- **UI**: Показывать время в локальной зоне

---

## Итоговый результат Stage 4

После выполнения всех задач:
1. ✅ AI ассистент "Leo" полностью функционален
2. ✅ Rate limiting работает для обоих тiers
3. ✅ Streaming ответы в реальном времени
4. ✅ Минимальный контекст для оптимизации
5. ✅ Интуитивный UI чата
6. ✅ Полное покрытие тестами

## Ключевые принципы

- **Простота** - без сохранения истории, минимальный стейт
- **Производительность** - streaming, оптимальные запросы
- **Безопасность** - rate limiting, проверка auth
- **UX** - понятные лимиты, хороший feedback
- **Масштабируемость** - готово к росту нагрузки