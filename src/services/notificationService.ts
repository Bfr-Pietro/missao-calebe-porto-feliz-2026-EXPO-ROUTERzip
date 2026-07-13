/**
 * Arquitetura de notificações locais (Expo Notifications).
 *
 * Conforme o escopo da Etapa 1, apenas a estrutura é criada aqui.
 * Nenhuma notificação é agendada ou disparada neste momento.
 * A implementação completa (agendamento de lembretes do diário,
 * avisos de sincronização, etc.) acontecerá em uma etapa futura.
 */

export interface INotificationService {
  requestPermissions(): Promise<boolean>;
  scheduleLocalNotification(title: string, body: string, triggerDate: Date): Promise<string>;
  cancelNotification(id: string): Promise<void>;
}

export const notificationService: INotificationService = {
  async requestPermissions() {
    // TODO: implementar com expo-notifications em etapa futura.
    return false;
  },
  async scheduleLocalNotification() {
    // TODO: implementar com expo-notifications em etapa futura.
    return "";
  },
  async cancelNotification() {
    // TODO: implementar com expo-notifications em etapa futura.
  },
};
