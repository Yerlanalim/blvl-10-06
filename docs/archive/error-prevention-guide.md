# 🛡️ Error Prevention Guide

Этот документ описывает систему предотвращения повторного появления известных ошибок в BizLevel проекте.

## 📋 Система мониторинга ошибок

### **1. Автоматический мониторинг (Development)**

**Файл**: `src/lib/debug/error-prevention.ts`

**Функции**:
- 🔍 **Hydration Monitor** - детектирует hydration mismatches
- 🔄 **Realtime Monitor** - отслеживает конфликты подписок
- ⚡ **Performance Monitor** - мониторит медленные операции
- 🌐 **Network Monitor** - детектирует HTTP 431 ошибки

**Подключение**: Автоматически активируется в development mode через `src/app/layout.tsx`

### **2. Pre-commit проверки**

**Файл**: `scripts/pre-commit-checks.js`

**Проверки**:
- Hydration risk patterns
- Realtime subscription issues  
- Next.js configuration problems
- Performance anti-patterns
- Dependency conflicts

**Запуск**: `node scripts/pre-commit-checks.js`

## 🚨 Известные проблемы и решения

### **Hydration Mismatch**

**Симптомы**:
```
Hydration failed because the server rendered HTML didn't match the client
```

**Причины**:
- Dynamic content без `suppressHydrationWarning`
- Server/client branch `if (typeof window !== 'undefined')`
- `Date.now()`, `Math.random()` без контроля
- External data без snapshot

**Решения**:
```tsx
// ✅ Правильно
<p suppressHydrationWarning>
  Choose the plan that fits your learning journey
</p>

// ✅ Для dynamic content
<div suppressHydrationWarning>
  {typeof window !== 'undefined' && (
    <ClientOnlyComponent />
  )}
</div>

// ✅ Используйте useEffect для client-only logic
const [isClient, setIsClient] = useState(false);
useEffect(() => setIsClient(true), []);
```

**Предотвращение**:
- Добавляйте `suppressHydrationWarning` для всех dynamic элементов
- Используйте `useEffect` для client-only логики
- Избегайте `Date.now()` в render функциях

### **HTTP 431 Request Header Fields Too Large**

**Симптомы**:
```
Error: Request Header Fields Too Large
```

**Причины**:
- Очень длинные error stack traces в development
- Large webpack dev tool settings
- Excessive error context в Next.js

**Решения**:
```typescript
// next.config.ts
webpack: (config, { isServer, dev }) => {
  if (dev) {
    config.devtool = 'eval-cheap-module-source-map';
    config.stats = 'minimal';
  }
  // ...
}
```

**Предотвращение**:
- Используйте lightweight source maps в dev mode
- Ограничивайте размер error output
- Избегайте чрезмерного логирования в development

### **Realtime Subscription Conflicts**

**Симптомы**:
```
Warning: tried to subscribe multiple times to the same subscription
```

**Причины**:
- Duplicate subscription IDs
- Missing cleanup в useEffect
- Concurrent subscription attempts
- React StrictMode double execution

**Решения**:
```typescript
// ✅ Уникальные IDs
const subscriberId = `hookName-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// ✅ Error handling
realtimeManager.subscribe(/* ... */)
  .then(unsubscribe => {
    cleanup = unsubscribe;
  })
  .catch(error => {
    console.warn('Subscription error:', error);
  });

// ✅ Proper cleanup
return () => {
  if (cleanup) {
    cleanup();
  }
};
```

**Предотвращение**:
- Всегда используйте уникальные subscription IDs
- Добавляйте error handling для всех subscriptions
- Правильно cleanup subscriptions в useEffect

### **Next.js 15 Configuration Conflicts**

**Симптомы**:
```
Error: optimization.usedExports can't be used with cacheUnaffected
```

**Причины**:
- Manual webpack `usedExports: true` setting
- Конфликт с Next.js 15 caching system
- Старые webpack optimization patterns

**Решения**:
```typescript
// ❌ Неправильно в Next.js 15
config.optimization = {
  usedExports: true,  // <- Убрать!
  sideEffects: false,
};

// ✅ Правильно - позволить Next.js управлять
// Убрать manual optimization settings
```

**Предотвращение**:
- Избегайте manual webpack optimization в Next.js 15
- Доверяйте built-in optimization системе
- Используйте только bundle splitting конфигурации

## 🎯 Процедуры проверки

### **Перед каждым коммитом**:

1. **Запустите проверки**:
   ```bash
   node scripts/pre-commit-checks.js
   ```

2. **Проверьте dev сервер**:
   ```bash
   npm run dev
   # Проверьте console на ошибки
   ```

3. **Тестируйте основные flow**:
   - Навигация между страницами
   - Login/logout
   - Realtime updates (если есть)

### **После major изменений**:

1. **Bundle analysis**:
   ```bash
   npm run build
   npm run analyze
   ```

2. **Performance check**:
   - Lighthouse score
   - Bundle sizes
   - Loading times

3. **Error monitoring status**:
   ```javascript
   // В browser console
   window.errorPreventionSystem?.getStatus()
   ```

## 📊 Мониторинг в production

### **Vercel Analytics**
- Core Web Vitals tracking
- Error rate monitoring  
- Performance metrics

### **Supabase Logs**
- Database error tracking
- Realtime connection issues
- Auth flow problems

### **Custom Error Boundaries**
- Component-level error catching
- User-friendly error display
- Error reporting to analytics

## 🔧 Tools и Scripts

### **Development**:
```bash
# Error prevention checks
node scripts/pre-commit-checks.js

# Error monitoring status  
npm run dev
# Check browser console for error prevention reports
```

### **Build & Deploy**:
```bash
# Production build with analysis
npm run build
npm run analyze

# Type checking
npm run type-check

# Linting
npm run lint
```

## 📚 Дополнительные ресурсы

- [Next.js 15 Migration Guide](https://nextjs.org/docs/app/building-your-application/upgrading/version-15)
- [React 19 Hydration Changes](https://react.dev/blog/2024/04/25/react-19)
- [Supabase Realtime Best Practices](https://supabase.com/docs/guides/realtime)
- [Vercel Analytics Guide](https://vercel.com/docs/analytics)

## 🎯 Резюме

1. **Система работает автоматически** в development mode
2. **Pre-commit checks** предотвращают коммиты с известными проблемами  
3. **Real-time monitoring** выявляет проблемы сразу при их появлении
4. **Документированные решения** для быстрого исправления
5. **Prevention over fixing** - предотвращаем, а не исправляем

**Правило**: Если проблема возникла дважды, добавляйте её в систему предотвращения! 