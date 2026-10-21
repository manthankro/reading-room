/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

import { Route as rootRouteImport } from './routes/__root'
import { Route as IndexRouteImport } from './routes/index'
import { Route as LoginRouteImport } from './routes/login'
import { Route as ReadSlugRouteImport } from './routes/read.$slug'
import { Route as WritersRouteImport } from './routes/writers'
import { Route as AdminWritersRouteImport } from './routes/admin.writers'
import { Route as ApiAuthSplatRouteImport } from './routes/api/auth/$'

const IndexRoute = IndexRouteImport.update({ id: '/', path: '/', getParentRoute: () => rootRouteImport } as any)
const LoginRoute = LoginRouteImport.update({ id: '/login', path: '/login', getParentRoute: () => rootRouteImport } as any)
const ReadSlugRoute = ReadSlugRouteImport.update({ id: '/read/$slug', path: '/read/$slug', getParentRoute: () => rootRouteImport } as any)
const WritersRoute = WritersRouteImport.update({ id: '/writers', path: '/writers', getParentRoute: () => rootRouteImport } as any)
const AdminWritersRoute = AdminWritersRouteImport.update({ id: '/admin/writers', path: '/admin/writers', getParentRoute: () => rootRouteImport } as any)
const ApiAuthSplatRoute = ApiAuthSplatRouteImport.update({ id: '/api/auth/$', path: '/api/auth/$', getParentRoute: () => rootRouteImport } as any)

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/login': typeof LoginRoute
  '/read/$slug': typeof ReadSlugRoute
  '/writers': typeof WritersRoute
  '/admin/writers': typeof AdminWritersRoute
  '/api/auth/$': typeof ApiAuthSplatRoute
}
export interface FileRoutesByTo extends FileRoutesByFullPath {}
export interface FileRoutesById {
  __root__: typeof rootRouteImport
  '/': typeof IndexRoute
  '/login': typeof LoginRoute
  '/read/$slug': typeof ReadSlugRoute
  '/writers': typeof WritersRoute
  '/admin/writers': typeof AdminWritersRoute
  '/api/auth/$': typeof ApiAuthSplatRoute
}
export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '/login' | '/read/$slug' | '/writers' | '/admin/writers' | '/api/auth/$'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/login' | '/read/$slug' | '/writers' | '/admin/writers' | '/api/auth/$'
  id: '__root__' | '/' | '/login' | '/read/$slug' | '/writers' | '/admin/writers' | '/api/auth/$'
  fileRoutesById: FileRoutesById
}
export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  LoginRoute: typeof LoginRoute
  ReadSlugRoute: typeof ReadSlugRoute
  WritersRoute: typeof WritersRoute
  AdminWritersRoute: typeof AdminWritersRoute
  ApiAuthSplatRoute: typeof ApiAuthSplatRoute
}
declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': { id: '/'; path: '/'; fullPath: '/'; preLoaderRoute: typeof IndexRouteImport; parentRoute: typeof rootRouteImport }
    '/login': { id: '/login'; path: '/login'; fullPath: '/login'; preLoaderRoute: typeof LoginRouteImport; parentRoute: typeof rootRouteImport }
    '/read/$slug': { id: '/read/$slug'; path: '/read/$slug'; fullPath: '/read/$slug'; preLoaderRoute: typeof ReadSlugRouteImport; parentRoute: typeof rootRouteImport }
    '/writers': { id: '/writers'; path: '/writers'; fullPath: '/writers'; preLoaderRoute: typeof WritersRouteImport; parentRoute: typeof rootRouteImport }
    '/admin/writers': { id: '/admin/writers'; path: '/admin/writers'; fullPath: '/admin/writers'; preLoaderRoute: typeof AdminWritersRouteImport; parentRoute: typeof rootRouteImport }
    '/api/auth/$': { id: '/api/auth/$'; path: '/api/auth/$'; fullPath: '/api/auth/$'; preLoaderRoute: typeof ApiAuthSplatRouteImport; parentRoute: typeof rootRouteImport }
  }
}
const rootRouteChildren: RootRouteChildren = {
  IndexRoute, LoginRoute, ReadSlugRoute, WritersRoute, AdminWritersRoute, ApiAuthSplatRoute,
}
export const routeTree = rootRouteImport._addFileChildren(rootRouteChildren)._addFileTypes<FileRouteTypes>()

import type { getRouter } from './router.tsx'
declare module '@tanstack/react-start' {
  interface Register {
    ssr: true
    router: Awaited<ReturnType<typeof getRouter>>
  }
}
