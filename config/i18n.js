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
