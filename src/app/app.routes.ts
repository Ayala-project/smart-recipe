import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'welcome', loadComponent: () => import('./pages/welcome-page/welcome-page.component').then(m => m.WelcomePageComponent) },
  { path: 'register', loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent) },
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
  { path: 'camera', loadComponent: () => import('./pages/camera/camera.component').then(m => m.CameraComponent) },
  { path: 'questions', loadComponent: () => import('./pages/questions-recipes/questions-recipes.component').then(m => m.QuestionsRecipesComponent) },
  { path: 'questions-recipes', loadComponent: () => import('./pages/questions-recipes/questions-recipes.component').then(m => m.QuestionsRecipesComponent) },
  { path: 'recipe-book', loadComponent: () => import('./pages/recipe-book/recipe-book.component').then(m => m.RecipeBookComponent) },
  { path: 'post-login', loadComponent: () => import('./pages/post-login/post-login.component').then(m => m.PostLoginComponent) },
  { path: 'loading', loadComponent: () => import('./pages/loading/loading.component').then(m => m.LoadingComponent) },
  { path: '', redirectTo: 'welcome', pathMatch: 'full' }
];