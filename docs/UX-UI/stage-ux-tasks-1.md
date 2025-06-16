# Stage UX Tasks 1: Прогрессивное разблокирование блоков уровня (ОПТИМИЗИРОВАННЫЙ ПОДХОД)

## 🎯 Цель
Изменить UX уровней с пошагового прохождения на **единое окно с прогрессивным разблокированием блоков**. Максимально использовать существующие компоненты.

## 📋 Техническое описание
- **Текущее состояние**: Пошаговое прохождение с навигацией между шагами (`/app/lesson/[id]`)
- **Новое состояние**: Все блоки видны сразу, разблокируются постепенно (`/app/level/[id]`)
- **Логика разблокировки**: Заголовок (3 сек) → Текст → Видео → Тест → ... → Артефакт → Завершение

## 🚀 Оптимизированный план (3 задачи, 2-3 часа)

### ✅ Что переиспользуем на 100%:
- `TextContent`, `VideoPlayer`, `TestWidget`, `CompletionScreen` - готовы как есть
- `useUserProgress` - вся логика сохранения прогресса работает
- Вся система авторизации и доступа к уровням
- Все UI компоненты (Card, Button, shadcn/ui)
- База данных и API endpoints

---

## Task 1: BlockContainer - Визуальные состояния блоков (30 минут)

### Цель
Создать обертку для контента с визуальными состояниями блокировки

### Файл для создания
**`src/components/level/BlockContainer.tsx`**

### Логика реализации
```typescript
interface BlockContainerProps {
  children: React.ReactNode;
  title: string;
  type: 'title' | 'text' | 'video' | 'test' | 'completion';
  state: 'locked' | 'active' | 'completed';
  order: number;
  onUnlock?: () => void; // Для auto-unlock заголовка
}
```

### Состояния блоков:
- **`locked`**: Серый, полупрозрачный, `pointer-events: none`
- **`active`**: Полноцветный, интерактивный, подсветка границы
- **`completed`**: Зеленая галочка, мягкая зеленая рамка

### Анимации:
- Плавное появление при разблокировке (opacity + translateY)
- Пульсация при активации
- Простые CSS transitions

---

## Task 2: LevelProgressiveView - Главный компонент (1.5 часа)

### Цель
Создать основной контейнер для прогрессивного UX

### Файл для создания
**`src/components/level/LevelProgressiveView.tsx`**

### Логика (копируем из LessonContainer):
1. **Загрузка данных** - точно как в `LessonContainer`:
   ```typescript
   // Берем всю логику загрузки lessonSteps
   // Берем всю логику loadStepProgress
   // Берем всю логику updateProgress
   ```

2. **Состояние разблокировки**:
   ```typescript
   const [unlockedBlocks, setUnlockedBlocks] = useState<number[]>([]);
   const [autoUnlockTimer, setAutoUnlockTimer] = useState<number | null>(null);
   ```

3. **Логика разблокировки** (простая):
   ```typescript
   // Заголовок: автоматически через 3 сек
   useEffect(() => {
     const timer = setTimeout(() => unlockBlock(0), 3000);
     return () => clearTimeout(timer);
   }, []);
   
   // Остальные блоки: при onComplete из существующих компонентов
   const handleBlockComplete = (blockIndex: number) => {
     updateProgress(blockIndex); // Используем существующую функцию
     unlockBlock(blockIndex + 1); // Разблокируем следующий
   };
   ```

4. **Рендеринг**:
   ```typescript
   return (
     <div className="max-w-4xl mx-auto space-y-6">
       {/* Заголовок уровня - BlockContainer */}
       <BlockContainer title="Level Introduction" type="title" state={getBlockState(0)}>
         <LevelHeader level={level} />
       </BlockContainer>

       {/* Все шаги - используем существующие компоненты */}
       {lessonSteps.map((step, index) => (
         <BlockContainer key={index} title={`Step ${index + 1}`} type={step.step_type} state={getBlockState(index + 1)}>
           {renderStepContent(step, index)} {/* Копируем из LessonContainer */}
         </BlockContainer>
       ))}

       {/* Completion - если все завершено */}
       {isCompleted && (
         <BlockContainer title="Level Complete" type="completion" state="active">
           <CompletionScreen {...existingProps} />
         </BlockContainer>
       )}
     </div>
   );
   ```

### Переиспользование из LessonContainer:
- `renderStepContent()` - точно та же функция switch/case
- `updateProgress()` - без изменений
- `loadStepProgress()` - без изменений
- Вся логика с `userTier`, `artifactTemplate`, etc.

---

## Task 3: Новый роут и интеграция (15 минут)

### Файлы для создания/изменения

#### 3.1: Новая страница
**`src/app/app/level/[id]/page.tsx`**
```typescript
// Копируем полностью из lesson/[id]/page.tsx
// Меняем только:
// - import LessonContainer -> import LevelProgressiveView
// - <LessonContainer> -> <LevelProgressiveView>
```

#### 3.2: Обновить LevelCard
**`src/components/level/LevelCard.tsx`** (1 строка):
```typescript
// Было:
href={canClick ? `/app/lesson/${level.id}` : '#'}
// Стало:
href={canClick ? `/app/level/${level.id}` : '#'}
```

---

## 🔄 Миграционная стратегия

### Параллельная работа:
- Старый UX: `/app/lesson/[id]` - остается без изменений
- Новый UX: `/app/level/[id]` - новая функциональность
- Одна ссылка в `LevelCard` переключает между ними

### A/B тестирование:
```typescript
// В LevelCard.tsx можно добавить feature flag:
const useProgressiveUX = process.env.NEXT_PUBLIC_PROGRESSIVE_UX === 'true';
const href = useProgressiveUX ? `/app/level/${level.id}` : `/app/lesson/${level.id}`;
```

### Безопасность:
- Никаких breaking changes
- Вся существующая функциональность сохраняется
- База данных не изменяется

---

## 📊 Ожидаемые результаты

### Время разработки:
- **Task 1**: 30 минут (простой UI компонент)
- **Task 2**: 1.5 часа (копирование + адаптация логики)
- **Task 3**: 15 минут (создание роута + 1 ссылка)
- **Итого**: 2.25 часа

### Код:
- **Новых файлов**: 3
- **Измененных файлов**: 1 
- **Переиспользованного кода**: ~90%

### Риски:
- **Минимальные** - не трогаем работающий код
- **Откат** - просто меняем ссылку обратно
- **Тестирование** - можно тестировать параллельно

---

## 🎯 Приоритеты выполнения

### Порядок задач:
1. **Task 1** (BlockContainer) - независимый UI компонент
2. **Task 2** (LevelProgressiveView) - основная логика
3. **Task 3** (интеграция) - подключение к роутам

### После завершения:
- Протестировать на одном уровне
- Собрать feedback
- При успехе - переключить все уровни
- При проблемах - быстрый откат

---

## 📝 Технические детали

### useProgressiveUnlock НЕ НУЖЕН
Вместо отдельного хука используем простую логику в компоненте:
```typescript
const [unlockedBlocks, setUnlockedBlocks] = useState<number[]>([]);

const unlockBlock = (index: number) => {
  setUnlockedBlocks(prev => [...prev, index]);
};

const getBlockState = (index: number): 'locked' | 'active' | 'completed' => {
  if (stepProgress[index]) return 'completed';
  if (unlockedBlocks.includes(index)) return 'active';
  return 'locked';
};
```

### Анимации - CSS only
```css
.block-unlock {
  animation: slideInFromBottom 0.5s ease-out;
}

.block-pulse {
  animation: pulse 1s ease-in-out;
}
```

### Accessibility
- Заблокированные блоки: `aria-disabled="true"`
- Screen reader announcements при разблокировке
- Focus management

---

## ✅ Преимущества нового подхода

1. **Быстро** - 2.25 часа вместо 10+ часов
2. **Безопасно** - минимум изменений
3. **Гибко** - легко откатиться или переключаться
4. **Масштабируемо** - добавление новых типов блоков простое
5. **Maintainable** - переиспользуем проверенный код

**Готов к реализации!** 🚀
