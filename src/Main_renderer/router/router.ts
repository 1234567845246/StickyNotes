import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import NoteList from '../components/NoteList.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: NoteList
  }, {
    path: '/trash',
    name: 'trash',
    component: import('../components/TrashView.vue')
  }, {
    path: '/edit/:id',
    name: 'edit',
    component: import('../components/NoteEditor.vue'),
    props: true
  }, {
    path: '/create',
    name: 'create',
    component: import('../components/NoteEditor.vue'),
    props: { isNew: true }
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;