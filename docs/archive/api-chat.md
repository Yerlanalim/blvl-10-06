# Chat API Endpoint

## Overview
API endpoint для общения с AI ассистентом "Leo" в BizLevel.

## Endpoint
`POST /api/chat`

## Request Format
```json
{
  "message": "Your question to Leo"
}
```

## Authentication
Требует авторизованного пользователя. Использует Supabase Auth cookies.

## Rate Limiting
- **Free users**: 30 сообщений всего (без сброса)
- **Paid users**: 30 сообщений в день (сбрасывается каждые 24 часа)

## Response Format
Streaming text response (плейн текст)

## Status Codes
- `200` - Успешный ответ (streaming)
- `400` - Неверный запрос (отсутствует message)
- `401` - Не авторизован
- `404` - Профиль пользователя не найден
- `429` - Превышен лимит сообщений
- `500` - Внутренняя ошибка сервера

## Error Response (JSON)
```json
{
  "error": "Error message",
  "type": "error_type",
  "message": "Detailed message"
}
```

## Features
- ✅ Авторизация через Supabase Auth
- ✅ Rate limiting (free/paid tiers)
- ✅ User context для персонализации
- ✅ Streaming ответы в реальном времени
- ✅ Автоматический сброс для paid users
- ✅ Proper error handling

## Implementation Details
- Использует Gemini API для генерации ответов
- Минимальный контекст пользователя для оптимизации
- Транзакционное обновление счетчика сообщений
- Streaming через ReadableStream 