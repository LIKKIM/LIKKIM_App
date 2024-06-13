import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-react-native-language-detector";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          "Add Wallet": "Add Wallet",
          "Create Wallet": "Create Wallet",
          "Import Wallet": "Import Wallet",
          Close: "Close",
          "Value:": "Value:",
          "Delete Card": "Delete Card",
          "Select Language": "Select Language",
          Cancel: "Cancel",
          "Select Currency": "Select Currency",
          "Set Password": "Set Password",
          "Only you can unlock your wallet": "Only you can unlock your wallet",
          Password: "Password",
          "Confirm Password": "Confirm Password",
          "Change Password": "Change Password",
          "Default Currency": "Default Currency",
          "Help & Support": "Help & Support",
          "Privacy & Data": "Privacy & Data",
          About: "About",
          Language: "Language",
          "Dark Mode": "Dark Mode",
          Bluetooth: "Bluetooth",
          "Pair with Bluetooth": "Pair with Bluetooth",
          "LOOKING FOR DEVICES": "LOOKING FOR DEVICES",
          "Scanning...": "Scanning...",
          "Please make sure your Cold Wallet is unlocked and Bluetooth is enabled.":
            "Please make sure your Cold Wallet is unlocked and Bluetooth is enabled.",
        },
      },
      zh: {
        translation: {
          "Add Wallet": "添加钱包",
          "Create Wallet": "创建钱包",
          "Import Wallet": "导入钱包",
          Close: "关闭",
          "Value:": "值:",
          "Delete Card": "删除卡片",
          "Select Language": "选择语言",
          Cancel: "取消",
          "Select Currency": "选择货币",
          "Set Password": "设置密码",
          "Only you can unlock your wallet": "只有你可以解锁你的钱包",
          Password: "密码",
          "Confirm Password": "确认密码",
          "Change Password": "更改密码",
          "Default Currency": "默认货币",
          "Help & Support": "帮助与支持",
          "Privacy & Data": "隐私与数据",
          About: "关于",
          Language: "语言",
          "Dark Mode": "黑暗模式",
          Bluetooth: "蓝牙",
          "Pair with Bluetooth": "与蓝牙配对",
          "LOOKING FOR DEVICES": "寻找设备",
          "Scanning...": "扫描中...",
          "Please make sure your Cold Wallet is unlocked and Bluetooth is enabled.":
            "请确保你的冷钱包已解锁并启用蓝牙。",
        },
      },
      fr: {
        translation: {
          "Add Wallet": "Ajouter un portefeuille",
          "Create Wallet": "Créer un portefeuille",
          "Import Wallet": "Importer un portefeuille",
          Close: "Fermer",
          "Value:": "Valeur :",
          "Delete Card": "Supprimer la carte",
          "Select Language": "Choisir la langue",
          Cancel: "Annuler",
          "Select Currency": "Sélectionnez la devise",
          "Set Password": "Définir le mot de passe",
          "Only you can unlock your wallet":
            "Seul vous pouvez déverrouiller votre portefeuille",
          Password: "Mot de passe",
          "Confirm Password": "Confirmer le mot de passe",
          "Change Password": "Changer le mot de passe",
          "Default Currency": "Devise par défaut",
          "Help & Support": "Aide et support",
          "Privacy & Data": "Confidentialité et données",
          About: "À propos",
          Language: "Langue",
          "Dark Mode": "Mode sombre",
          Bluetooth: "Bluetooth",
          "Pair with Bluetooth": "Appairer avec Bluetooth",
          "LOOKING FOR DEVICES": "RECHERCHE DE PÉRIPHÉRIQUES",
          "Scanning...": "Balayage...",
          "Please make sure your Cold Wallet is unlocked and Bluetooth is enabled.":
            "Veuillez vous assurer que votre portefeuille froid est déverrouillé et que le Bluetooth est activé.",
        },
      },
      es: {
        translation: {
          "Add Wallet": "Agregar billetera",
          "Create Wallet": "Crear billetera",
          "Import Wallet": "Importar billetera",
          Close: "Cerrar",
          "Value:": "Valor:",
          "Delete Card": "Eliminar tarjeta",
        },
      },
      ar: {
        translation: {
          "Add Wallet": "أضف محفظة",
          "Create Wallet": "إنشاء محفظة",
          "Import Wallet": "استيراد محفظة",
          Close: "إغلاق",
          "Value:": "القيمة:",
          "Delete Card": "حذف البطاقة",
        },
      },
      ja: {
        translation: {
          "Add Wallet": "ウォレットを追加",
          "Create Wallet": "ウォレットを作成",
          "Import Wallet": "ウォレットをインポート",
          Close: "閉じる",
          "Value:": "値:",
          "Delete Card": "カードを削除",
        },
      },
      ru: {
        translation: {
          "Add Wallet": "Добавить кошелек",
          "Create Wallet": "Создать кошелек",
          "Import Wallet": "Импортировать кошелек",
          Close: "Закрыть",
          "Value:": "Значение:",
          "Delete Card": "Удалить карту",
        },
      },
      ko: {
        translation: {
          "Add Wallet": "지갑 추가",
          "Create Wallet": "지갑 만들기",
          "Import Wallet": "지갑 가져오기",
          Close: "닫기",
          "Value:": "값:",
          "Delete Card": "카드 삭제",
        },
      },
      pt: {
        translation: {
          "Add Wallet": "Adicionar carteira",
          "Create Wallet": "Criar carteira",
          "Import Wallet": "Importar carteira",
          Close: "Fechar",
          "Value:": "Valor:",
          "Delete Card": "Excluir cartão",
        },
      },
      it: {
        translation: {
          "Add Wallet": "Aggiungi portafoglio",
          "Create Wallet": "Crea portafoglio",
          "Import Wallet": "Importa portafoglio",
          Close: "Chiudi",
          "Value:": "Valore:",
          "Delete Card": "Elimina carta",
        },
      },
      de: {
        translation: {
          "Add Wallet": "Brieftasche hinzufügen",
          "Create Wallet": "Brieftasche erstellen",
          "Import Wallet": "Brieftasche importieren",
          Close: "Schließen",
          "Value:": "Wert:",
          "Delete Card": "Karte löschen",
        },
      },
    },
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
