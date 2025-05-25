export type RootStackParamList = {
  ChatList: undefined;
  ChatDetail: {number: string};
  ChatMessage: {number: string};
  FamilyList: undefined;
  Settings: {
    addApprovedNumber?: {
      number: string;
      showModal: boolean;
    };
  };
  SettingsTab: {
    screen: 'Settings';
    params?: {
      addApprovedNumber?: {
        number: string;
        showModal: boolean;
      };
    };
  };
};

export type RootTabParamList = {
  ChatTab: undefined;
  FamilyTab: undefined;
  SettingsTab: undefined;
};
