import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import NoteList from '../components/NoteList.vue';
import TrashView from '../components/TrashView.vue';
import NoteEditor from '../components/NoteEditor.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: NoteList
  }, {
    path: '/trash',
    name: 'trash',
    component: TrashView
  }, {
    path: '/edit/:id',
    name: 'edit',
    component: NoteEditor,
    props: true
  }, {
    path: '/create',
    name: 'create',
    component: NoteEditor,
    props: { isNew: true }
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;