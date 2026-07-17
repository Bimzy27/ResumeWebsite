<script setup lang="ts">
import { TresCanvas } from '@tresjs/core'
import { NoToneMapping } from 'three'
import type { Book } from '../types'
import BookCarousel from './BookCarousel.vue'

// The heavy half of the bookshelf section: TresCanvas, lights, camera, and
// the book carousel. Split out of BookshelfSection.vue so that everything
// touching three/@tresjs/core lives in a lazily loaded chunk -
// BookshelfSection only async-imports this component once its
// useSectionScene gates pass.

defineProps<{ books: Book[] }>()

const emit = defineEmits<{
  // Pointer entered/left a book. null on leave.
  hover: [bookId: string | null]
}>()

// Reference BookCarousel explicitly so noUnusedLocals is satisfied.
// (vue-tsc sometimes fails to detect template-only usage inside TresCanvas.)
void BookCarousel
</script>

<template>
  <TresCanvas
    alpha
    :clear-alpha="0"
    :tone-mapping="NoToneMapping"
  >
    <!-- Framed for the tall half-width column this scene lives in
         (the canvas only mounts above 900px, where the row is always
         two columns): pulled back and raised so the full ring fits the
         narrow horizontal fov with the shelf sitting low in frame. -->
    <TresPerspectiveCamera
      :position="[0, 1.2, 4.9]"
      :fov="46"
      :look-at="[0, 0, 0]"
    />
    <TresAmbientLight :intensity="0.9" />
    <TresDirectionalLight
      :position="[-3, 5, 4]"
      :intensity="1.0"
    />
    <TresDirectionalLight
      :position="[3, 2, -1]"
      :intensity="0.35"
      color="#7c3aed"
    />
    <BookCarousel
      :books="books"
      @hover="emit('hover', $event)"
    />
  </TresCanvas>
</template>
