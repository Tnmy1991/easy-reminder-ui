export namespace EasyReminderNamespace {
  export enum MediumType {
    SMS = 'SMS',
    EMAIL = 'Email',
  }

  export interface RecipientList {
    id: number;
    type: MediumType;
    recipient: string;
    checked: boolean;
    editMode: boolean;
  }
}
