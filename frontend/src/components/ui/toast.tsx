import { Toast } from '@base-ui/react/toast'
import { Icon } from './common'

export type NotificationType = 'success' | 'error' | 'info'

type Notification = {
  title: string
  description?: string
  timeout?: number
  id?: string
}

export const toastManager = Toast.createToastManager()

const add = (type: NotificationType, notification: Notification) =>
  toastManager.add({
    ...notification,
    type,
    priority: type === 'error' ? 'high' : 'low',
  })

export const notify = {
  success: (notification: Notification) => add('success', notification),
  error: (notification: Notification) => add('error', notification),
  info: (notification: Notification) => add('info', notification),
}

function ToastList() {
  const { toasts } = Toast.useToastManager()

  return toasts.map((toast) => (
    <Toast.Root key={toast.id} toast={toast} className="toast" swipeDirection="right">
      <Toast.Content className="toast-content">
        <span className="toast-indicator" aria-hidden="true">
          <Icon name={toast.type === 'success' ? 'circle-arrow-up' : 'circle-arrow-down'} size={18} />
        </span>
        <span className="toast-message">
          <Toast.Title className="toast-title" />
          <Toast.Description className="toast-description" />
        </span>
        <Toast.Close className="toast-close" aria-label="Fechar notificação">
          <Icon name="x" size={18} />
        </Toast.Close>
      </Toast.Content>
    </Toast.Root>
  ))
}

export function Toaster() {
  return (
    <Toast.Provider toastManager={toastManager} limit={3} timeout={5000}>
      <Toast.Portal>
        <Toast.Viewport className="toast-viewport" aria-label="Notificações">
          <ToastList />
        </Toast.Viewport>
      </Toast.Portal>
    </Toast.Provider>
  )
}
