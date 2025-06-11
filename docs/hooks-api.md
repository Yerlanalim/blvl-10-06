# BizLevel Hooks API Documentation

## useUserProgress

Хук для отслеживания прогресса пользователя по всем уровням.

### Usage
```typescript
const { userProgress, loading, error, refreshProgress } = useUserProgress(userId);
```

### Parameters
- `userId` (string | undefined) - ID пользователя

### Returns
- `userProgress` (UserProgressResult | null) - Объект с прогрессом пользователя
- `loading` (boolean) - Состояние загрузки
- `error` (string | null) - Ошибка загрузки
- `refreshProgress` (function) - Функция для обновления прогресса

### UserProgressResult Structure
```typescript
interface UserProgressResult {
  currentLevel: number;           // Текущий доступный уровень
  completedLevels: number[];      // Завершенные уровни
  tierType: 'free' | 'paid';      // Тип подписки
  aiMessagesCount: number;        // Количество AI сообщений
  profile: UserProfile;           // Профиль пользователя
  progressByLevel: Record<number, { // Детальный прогресс по уровням
    current_step: number;
    total_steps: number;
    percentage: number;
  }>;
}
```

### Features
- Автоматическое обновление через realtime subscriptions
- Оптимизированные запросы к БД (избегает N+1 проблемы)
- Кэширование результатов

## useLevelAccess

Хук для проверки доступа к конкретному уровню.

### Usage
```typescript
const { canAccess, isLocked, reason, level, loading, error, refreshAccess } = useLevelAccess(levelId, userId);
```

### Parameters
- `levelId` (number) - ID уровня
- `userId` (string | undefined) - ID пользователя

### Returns
- `canAccess` (boolean) - Может ли пользователь получить доступ к уровню
- `isLocked` (boolean) - Заблокирован ли уровень
- `reason` (string | undefined) - Причина блокировки
- `level` (Level | undefined) - Данные уровня
- `loading` (boolean) - Состояние загрузки
- `error` (string | null) - Ошибка
- `refreshAccess` (function) - Функция для обновления статуса доступа

### Access Rules
1. **Free tier**: Доступ только к уровням 1-3
2. **Paid tier**: Доступ ко всем уровням 1-10
3. **Sequential access**: Нужно завершить предыдущий уровень для доступа к следующему
4. **Current level**: Пользователь может получить доступ к текущему уровню и всем предыдущим

## Performance Optimizations

### Database Query Optimization
- `useUserProgress`: Использует один запрос для всех lesson_steps вместо множественных запросов
- Кэширование результатов в React Query (встроено в template)
- Realtime subscriptions только для изменений данных пользователя

### Component Optimization
- `useMemo` для вычисляемых значений
- `useCallback` для функций обратного вызова
- Lazy loading компонентов урока

## Error Handling

### Common Error Scenarios
1. **Network errors**: Автоматический retry через React Query
2. **Permission errors**: Показ соответствующих сообщений
3. **Data consistency**: Валидация данных на клиенте и сервере
4. **Loading states**: Правильные индикаторы загрузки

### Error Recovery
- Graceful degradation при ошибках загрузки
- Fallback UI для критических ошибок
- Логирование ошибок для отладки

## Testing

### Manual Testing Checklist
- ✓ Доступ к уровням работает корректно
- ✓ Прогресс сохраняется правильно  
- ✓ Realtime обновления работают
- ✓ Ограничения tier'ов соблюдаются
- ✓ Навигация между шагами функционирует
- ✓ Обработка ошибок работает

### Integration Points
- Supabase RLS policies
- User authentication state
- Subscription status
- Progress synchronization

## Future Improvements

### Planned Features
1. Offline support для completed lessons
2. Advanced analytics and insights
3. Social features (leaderboards)
4. Custom learning paths
5. AI-powered recommendations

### Performance Monitoring
- Component render times tracking
- Database query performance
- User engagement metrics
- Error rate monitoring 