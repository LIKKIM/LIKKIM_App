import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-react-native-language-detector";
//en zh zh-TW fr es ar ja ru ko pt pt-BR it de hi mn th uk vi id tl bn
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
          Send: "Send",
          "Send crypto to another wallet": "Send crypto to another wallet",
          Receive: "Receive",
          "Receive crypto from another wallet":
            "Receive crypto from another wallet",
          "Transaction History": "Transaction History",
          "No Histories": "No Histories",
          "Enter the recipient's address:": "Enter the recipient's address:",
          "Enter Address": "Enter Address",
          Submit: "Submit",
          Cancel: "Cancel",
          "Choose the cryptocurrency to send:":
            "Choose the cryptocurrency to send:",
          "Choose the cryptocurrency to receive:":
            "Choose the cryptocurrency to receive:",
          "Address for": "Address for",
          Close: "Close",
          Wallet: "Wallet",
          Transactions: "Transactions",
          "My Cold Wallet": "My LIKKIM",
          "Total Balance": "Total Balance",
          Balance: "Balance",
          "No cryptocurrencies available. Please add wallet first.":
            "No cryptocurrencies available. Please add wallet first.",
          "This chain account will be removed":
            "This chain account will be removed",
          "Remove Chain Account": "Remove Chain Account",
          Remove: "Remove",
          "Security in your hands": "Security in your hands",
          "LIKKIM supports 27 blockchains and over 10,000 cryptocurrencies.":
            "LIKKIM supports 27 blockchains and over 10,000 cryptocurrencies.",
          Continue: "Continue",
          "Never share the recovery phrase.":
            "Never share the recovery phrase.",
          "Please save the recovery phrase displayed on the LIKKIM hardware wallet screen.":
            "Please save the recovery phrase displayed on the LIKKIM hardware wallet screen.",
          "Scroll down to view all words": "Scroll down to view all words",
          "Recovery Phrase": "Recovery Phrase",
          "Read the following, then save the phrase securely.":
            "Read the following, then save the phrase securely.",
          "The recovery phrase alone gives you full access to your wallets and funds.":
            "The recovery phrase alone gives you full access to your wallets and funds.",
          "If you forget your password, you can use the recovery phrase to get back into your wallet.":
            "If you forget your password, you can use the recovery phrase to get back into your wallet.",
          "LIKKIM will never ask for your recovery phrase.":
            "LIKKIM will never ask for your recovery phrase.",
          "Never share it with anyone.": "Never share it with anyone.",
          "You must select all 12 words before you can proceed.":
            "You must select all 12 words before you can proceed.",
          "Verify and I've Saved the Phrase":
            "Verify and I've Saved the Phrase",
          "Creating your wallet": "Creating your wallet",
          "Generating your accounts": "Generating your accounts",
          "Encrypting your data": "Encrypting your data",
          "Your wallet is now ready": "Your wallet is now ready",
          "Let's Go": "Let's Go",
          "Use spaces between words": "Use spaces between words",
          "Import Recovery Phrase": "Import Recovery Phrase",
          Version: "Version",
          "Only you can unlock your wallet": "Only you can unlock your wallet",
          "Assets can only be sent within the same chain.":
            "Assets can only be sent within the same chain.",
          "Firmware Update": "Firmware Update",
          "Sync balances to LIKKIM coldwallet":
            "Sync balances to LIKKIM coldwallet",
          "No data available": "No data available",
          "Search Currency": "Search Currency",
          "Search Cryptocurrency": "Search Cryptocurrency",
          "Select Currency": "Select Currency",
          "Enable Screen Lock": "Enable Screen Lock",
          "Enter new password": "Enter new password",
          "Confirm new password": "Confirm new password",
          "Change App Screen Lock Password": "Change App Screen Lock Password",
          "Disable Lock Screen": "Disable Lock Screen",
          "Enter your password": "Enter your password",
          "Enter Password to Unlock": "Enter Password to Unlock",
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
          Send: "发送",
          "Send crypto to another wallet": "发送加密货币到其他钱包",
          Receive: "接收",
          "Receive crypto from another wallet": "从其他钱包接收加密货币",
          "Transaction History": "交易记录",
          "No Histories": "没有记录",
          "Enter the recipient's address:": "输入接收者的地址:",
          "Enter Address": "输入地址",
          Submit: "提交",
          Cancel: "取消",
          "Choose the cryptocurrency to send:": "选择要发送的加密货币:",
          "Choose the cryptocurrency to receive:": "选择要接收的加密货币:",
          "Address for": "地址",
          Close: "关闭",
          Wallet: "钱包",
          Transactions: "交易",
          "My Cold Wallet": "我的LIKKIM",
          "Total Balance": "总余额",
          Balance: "余额",
          "No cryptocurrencies available. Please add wallet first.":
            "没有可用的加密货币。请先添加钱包。",
          "This chain account will be removed": "此链账户将被移除",
          "Remove Chain Account": "移除链账户",
          Remove: "移除",
          "Security in your hands": "安全尽在掌握",
          "LIKKIM supports 27 blockchains and over 10,000 cryptocurrencies.":
            "LIKKIM 支持 27 条区块链和超过 10,000 种加密货币。",
          Continue: "继续",
          "Never share the recovery phrase.": "不要分享恢复短语。",
          "Please save the recovery phrase displayed on the LIKKIM hardware wallet screen.":
            "请保存 LIKKIM 硬件钱包屏幕上显示的恢复短语。",
          "Scroll down to view all words": "向下滚动查看所有单词",
          "Recovery Phrase": "恢复短语",
          "Read the following, then save the phrase securely.":
            "请阅读以下内容，然后安全地保存恢复短语。",
          "The recovery phrase alone gives you full access to your wallets and funds.":
            "恢复短语可完全访问您的钱包和资金。",
          "If you forget your password, you can use the recovery phrase to get back into your wallet.":
            "如果您忘记密码，可以使用恢复短语重新进入您的钱包。",
          "LIKKIM will never ask for your recovery phrase.":
            "LIKKIM 永远不会要求您的恢复短语。",
          "Never share it with anyone.": "永远不要与任何人分享。",
          "You must select all 12 words before you can proceed.":
            "你必须选择所有12个单词才能继续。",
          "Verify and I've Saved the Phrase": "验证并且我已保存短语",
          "Creating your wallet": "创建你的钱包",
          "Generating your accounts": "生成你的账户",
          "Encrypting your data": "加密你的数据",
          "Your wallet is now ready": "你的钱包已准备就绪",
          "Let's Go": "开始吧",
          "Use spaces between words": "单词之间用空格分隔",
          "Import Recovery Phrase": "导入恢复短语",
          Version: "版本",
          "Only you can unlock your wallet": "只有你可以解锁你的钱包",
          "Assets can only be sent within the same chain.":
            "资产只能在同一链内发送。",
          "Firmware Update": "固件更新",
          "Sync balances to LIKKIM coldwallet": "同步余额到 LIKKIM 冷钱包",
          "No data available": "暂无数据",
          "Search Currency": "搜索货币",
          "Search Cryptocurrency": "搜索加密货币",
          "Select Currency": "选择货币",
          "Enable Screen Lock": "启用屏幕锁定",
          "Enter new password": "输入新密码",
          "Confirm new password": "确认新密码",
          "Change App Screen Lock Password": "更改应用屏幕锁密码",
          "Disable Lock Screen": "禁用屏幕锁定",
          "Enter your password": "输入您的密码",
          "Enter Password to Unlock": "输入密码以解锁",
        },
      },
      "zh-TW": {
        translation: {
          "Add Wallet": "添加錢包",
          "Create Wallet": "創建錢包",
          "Import Wallet": "導入錢包",
          Close: "關閉",
          "Value:": "值:",
          "Delete Card": "刪除卡片",
          "Select Language": "選擇語言",
          Cancel: "取消",
          "Select Currency": "選擇貨幣",
          "Set Password": "設置密碼",
          "Only you can unlock your wallet": "只有你可以解鎖你的錢包",
          Password: "密碼",
          "Confirm Password": "確認密碼",
          "Change Password": "更改密碼",
          "Default Currency": "默認貨幣",
          "Help & Support": "幫助與支持",
          "Privacy & Data": "隱私與數據",
          About: "關於",
          Language: "語言",
          "Dark Mode": "黑暗模式",
          Bluetooth: "藍牙",
          "Pair with Bluetooth": "與藍牙配對",
          "LOOKING FOR DEVICES": "尋找設備",
          "Scanning...": "掃描中...",
          "Please make sure your Cold Wallet is unlocked and Bluetooth is enabled.":
            "請確保你的冷錢包已解鎖並啟用藍牙。",
          Send: "發送",
          "Send crypto to another wallet": "發送加密貨幣到其他錢包",
          Receive: "接收",
          "Receive crypto from another wallet": "從其他錢包接收加密貨幣",
          "Transaction History": "交易記錄",
          "No Histories": "沒有記錄",
          "Enter the recipient's address:": "輸入接收者的地址:",
          "Enter Address": "輸入地址",
          Submit: "提交",
          "Choose the cryptocurrency to send:": "選擇要發送的加密貨幣:",
          "Choose the cryptocurrency to receive:": "選擇要接收的加密貨幣:",
          "Address for": "地址",
          Wallet: "錢包",
          Transactions: "交易",
          "My Cold Wallet": "我的LIKKIM",
          "Total Balance": "總餘額",
          Balance: "餘額",
          "No cryptocurrencies available. Please add wallet first.":
            "沒有可用的加密貨幣。請先添加錢包。",
          "This chain account will be removed": "此鏈賬戶將被移除",
          "Remove Chain Account": "移除鏈賬戶",
          Remove: "移除",
          "Security in your hands": "安全盡在掌握",
          "LIKKIM supports 27 blockchains and over 10,000 cryptocurrencies.":
            "LIKKIM 支持 27 條區塊鏈和超過 10,000 種加密貨幣。",
          Continue: "繼續",
          "Never share the recovery phrase.": "不要分享恢復短語。",
          "Please save the recovery phrase displayed on the LIKKIM hardware wallet screen.":
            "請保存 LIKKIM 硬體錢包螢幕上顯示的恢復短語。",
          "Scroll down to view all words": "向下滾動查看所有單詞",
          "Recovery Phrase": "恢復短語",
          "Read the following, then save the phrase securely.":
            "請閱讀以下內容，然後安全地保存恢復短語。",
          "The recovery phrase alone gives you full access to your wallets and funds.":
            "恢復短語可完全訪問您的錢包和資金。",
          "If you forget your password, you can use the recovery phrase to get back into your wallet.":
            "如果您忘記密碼，可以使用恢復短語重新進入您的錢包。",
          "LIKKIM will never ask for your recovery phrase.":
            "LIKKIM 永遠不會要求您的恢復短語。",
          "Never share it with anyone.": "永遠不要與任何人分享。",
          "You must select all 12 words before you can proceed.":
            "你必須選擇所有12個單詞才能繼續。",
          "Verify and I've Saved the Phrase": "驗證並且我已保存短語",
          "Creating your wallet": "創建你的錢包",
          "Generating your accounts": "生成你的帳戶",
          "Encrypting your data": "加密你的數據",
          "Your wallet is now ready": "你的錢包已準備就緒",
          "Let's Go": "開始吧",
          "Use spaces between words": "單詞之間用空格分隔",
          "Import Recovery Phrase": "導入恢復短語",
          Version: "版本",
          "Only you can unlock your wallet": "只有你可以解鎖你的錢包",
          "Assets can only be sent within the same chain.":
            "資產只能在同一鏈內發送。",
          "Firmware Update": "固件更新",
          "Sync balances to LIKKIM coldwallet": "同步餘額到 LIKKIM 冷錢包",
          "No data available": "暫無數據",
          "Search Currency": "搜尋貨幣",
          "Search Cryptocurrency": "搜尋加密貨幣",
          "Select Currency": "選擇貨幣",
          "Enable Screen Lock": "啟用螢幕鎖定",
          "Enter new password": "輸入新密碼",
          "Confirm new password": "確認新密碼",
          "Change App Screen Lock Password": "更改應用程式螢幕鎖密碼",
          "Disable Lock Screen": "禁用螢幕鎖定",
          "Enter your password": "輸入您的密碼",
          "Enter Password to Unlock": "輸入密碼以解鎖",
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
          Send: "Envoyer",
          "Send crypto to another wallet":
            "Envoyer des crypto-monnaies à un autre portefeuille",
          Receive: "Recevoir",
          "Receive crypto from another wallet":
            "Recevoir des crypto-monnaies d'un autre portefeuille",
          "Transaction History": "Historique des transactions",
          "No Histories": "Aucun historique",
          "Enter the recipient's address:":
            "Entrez l'adresse du destinataire :",
          "Enter Address": "Entrer l'adresse",
          Submit: "Soumettre",
          "Choose the cryptocurrency to send:":
            "Choisissez la crypto-monnaie à envoyer :",
          "Choose the cryptocurrency to receive:":
            "Choisissez la crypto-monnaie à recevoir :",
          "Address for": "Adresse pour",
          Wallet: "Portefeuille",
          Transactions: "Transactions",
          "My Cold Wallet": "Mon LIKKIM",
          "Total Balance": "Solde Total",
          Balance: "Solde",
          "No cryptocurrencies available. Please add wallet first.":
            "Aucune cryptomonnaie disponible. Veuillez d'abord ajouter un portefeuille.",
          "This chain account will be removed":
            "Ce compte de chaîne sera supprimé",
          "Remove Chain Account": "Supprimer le compte de chaîne",
          Remove: "Supprimer",
          "Security in your hands": "Sécurité entre vos mains",
          "LIKKIM supports 27 blockchains and over 10,000 cryptocurrencies.":
            "LIKKIM prend en charge 27 blockchains et plus de 10 000 crypto-monnaies.",
          Continue: "Continuer",
          "Never share the recovery phrase.":
            "Ne partagez jamais la phrase de récupération.",
          "Please save the recovery phrase displayed on the LIKKIM hardware wallet screen.":
            "Veuillez enregistrer la phrase de récupération affichée sur l'écran du portefeuille matériel LIKKIM.",
          "Scroll down to view all words":
            "Faites défiler vers le bas pour voir tous les mots",
          "Recovery Phrase": "Phrase de récupération",
          "Read the following, then save the phrase securely.":
            "Lisez ce qui suit, puis enregistrez la phrase en toute sécurité.",
          "The recovery phrase alone gives you full access to your wallets and funds.":
            "La phrase de récupération seule vous donne un accès complet à vos portefeuilles et fonds.",
          "If you forget your password, you can use the recovery phrase to get back into your wallet.":
            "Si vous oubliez votre mot de passe, vous pouvez utiliser la phrase de récupération pour revenir dans votre portefeuille.",
          "LIKKIM will never ask for your recovery phrase.":
            "LIKKIM ne vous demandera jamais votre phrase de récupération.",
          "Never share it with anyone.": "Ne la partagez jamais avec personne.",
          "You must select all 12 words before you can proceed.":
            "Vous devez sélectionner les 12 mots avant de pouvoir continuer.",
          "Verify and I've Saved the Phrase":
            "Vérifiez et j'ai sauvegardé la phrase",
          "Creating your wallet": "Création de votre portefeuille",
          "Generating your accounts": "Génération de vos comptes",
          "Encrypting your data": "Cryptage de vos données",
          "Your wallet is now ready": "Votre portefeuille est prêt",
          "Let's Go": "Allons-y",
          "Use spaces between words": "Utilisez des espaces entre les mots",
          "Import Recovery Phrase": "Importer la phrase de récupération",
          Version: "Version",
          "Only you can unlock your wallet":
            "Seul vous pouvez déverrouiller votre portefeuille",
          "Assets can only be sent within the same chain.":
            "Les actifs ne peuvent être envoyés que sur la même chaîne.",
          "Firmware Update": "Mise à jour du firmware",
          "Sync balances to LIKKIM coldwallet":
            "Synchroniser les soldes avec le portefeuille froid LIKKIM",
          "No data available": "Aucune donnée disponible",
          "Search Currency": "Rechercher une devise",
          "Search Cryptocurrency": "Rechercher une cryptomonnaie",
          "Select Currency": "Sélectionner une devise",
          "Enable Screen Lock": "Activer le verrouillage de l'écran",
          "Enter new password": "Entrez un nouveau mot de passe",
          "Confirm new password": "Confirmez le nouveau mot de passe",
          "Change App Screen Lock Password":
            "Changer le mot de passe de verrouillage de l'application",
          "Disable Lock Screen": "Désactiver le verrouillage de l'écran",
          "Enter your password": "Entrez votre mot de passe",
          "Enter Password to Unlock":
            "Entrez le mot de passe pour déverrouiller",
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
          "Select Language": "Seleccionar idioma",
          Cancel: "Cancelar",
          "Select Currency": "Seleccionar moneda",
          "Set Password": "Establecer contraseña",
          "Only you can unlock your wallet":
            "Solo tú puedes desbloquear tu billetera",
          Password: "Contraseña",
          "Confirm Password": "Confirmar contraseña",
          "Change Password": "Cambiar la contraseña",
          "Default Currency": "Moneda predeterminada",
          "Help & Support": "Ayuda y soporte",
          "Privacy & Data": "Privacidad y datos",
          About: "Acerca de",
          Language: "Idioma",
          "Dark Mode": "Modo oscuro",
          Bluetooth: "Bluetooth",
          "Pair with Bluetooth": "Emparejar con Bluetooth",
          "LOOKING FOR DEVICES": "BUSCANDO DISPOSITIVOS",
          "Scanning...": "Escaneando...",
          "Please make sure your Cold Wallet is unlocked and Bluetooth is enabled.":
            "Por favor, asegúrate de que tu billetera fría esté desbloqueada y el Bluetooth esté activado.",
          Send: "Enviar",
          "Send crypto to another wallet":
            "Enviar criptomonedas a otro monedero",
          Receive: "Recibir",
          "Receive crypto from another wallet":
            "Recibir criptomonedas de otro monedero",
          "Transaction History": "Historial de transacciones",
          "No Histories": "No hay historiales",
          "Enter the recipient's address:":
            "Ingrese la dirección del destinatario:",
          "Enter Address": "Ingrese la dirección",
          Submit: "Enviar",
          "Choose the cryptocurrency to send:":
            "Elija la criptomoneda para enviar:",
          "Choose the cryptocurrency to receive:":
            "Elija la criptomoneda para recibir:",
          "Address for": "Dirección para",
          Wallet: "Cartera",
          Transactions: "Transacciones",
          "My Cold Wallet": "Mi LIKKIM",
          "Total Balance": "Saldo Total",
          Balance: "Saldo",
          "No cryptocurrencies available. Please add wallet first.":
            "No hay criptomonedas disponibles. Por favor, agregue una billetera primero.",
          "This chain account will be removed":
            "Esta cuenta de cadena será eliminada",
          "Remove Chain Account": "Eliminar cuenta de cadena",
          Remove: "Eliminar",
          "Security in your hands": "Seguridad en tus manos",
          "LIKKIM supports 27 blockchains and over 10,000 cryptocurrencies.":
            "LIKKIM admite 27 cadenas de bloques y más de 10,000 criptomonedas.",
          Continue: "Continuar",
          "Never share the recovery phrase.":
            "Nunca compartas la frase de recuperación.",
          "Please save the recovery phrase displayed on the LIKKIM hardware wallet screen.":
            "Por favor, guarda la frase de recuperación que aparece en la pantalla del monedero de hardware LIKKIM.",
          "Scroll down to view all words":
            "Desplázate hacia abajo para ver todas las palabras",
          "Recovery Phrase": "Frase de recuperación",
          "Read the following, then save the phrase securely.":
            "Lea lo siguiente, luego guarde la frase de forma segura.",
          "The recovery phrase alone gives you full access to your wallets and funds.":
            "La frase de recuperación sola le da acceso completo a sus billeteras y fondos.",
          "If you forget your password, you can use the recovery phrase to get back into your wallet.":
            "Si olvida su contraseña, puede usar la frase de recuperación para volver a entrar en su billetera.",
          "LIKKIM will never ask for your recovery phrase.":
            "LIKKIM nunca le pedirá su frase de recuperación.",
          "Never share it with anyone.": "Nunca la comparta con nadie.",
          "You must select all 12 words before you can proceed.":
            "Debe seleccionar las 12 palabras antes de poder continuar.",
          "Verify and I've Saved the Phrase":
            "Verificar y he guardado la frase",
          "Creating your wallet": "Creando tu billetera",
          "Generating your accounts": "Generando tus cuentas",
          "Encrypting your data": "Encriptando tus datos",
          "Your wallet is now ready": "Tu billetera está lista",
          "Let's Go": "Vamos",
          "Use spaces between words": "Usa espacios entre las palabras",
          "Import Recovery Phrase": "Importar frase de recuperación",
          Version: "Versión",
          "Only you can unlock your wallet":
            "Solo tú puedes desbloquear tu billetera",
          "Assets can only be sent within the same chain.":
            "Los activos solo se pueden enviar dentro de la misma cadena.",
          "Firmware Update": "Actualización de firmware",
          "Sync balances to LIKKIM coldwallet":
            "Sincronizar saldos con la billetera fría LIKKIM",
          "No data available": "No hay datos disponibles",
          "Search Currency": "Buscar moneda",
          "Search Cryptocurrency": "Buscar criptomoneda",
          "Select Currency": "Seleccionar moneda",
          "Enable Screen Lock": "Habilitar bloqueo de pantalla",
          "Enter new password": "Ingrese nueva contraseña",
          "Confirm new password": "Confirmar nueva contraseña",
          "Change App Screen Lock Password":
            "Cambiar contraseña de bloqueo de pantalla de la aplicación",
          "Disable Lock Screen": "Desactivar bloqueo de pantalla",
          "Enter your password": "Ingrese su contraseña",
          "Enter Password to Unlock": "Ingrese la contraseña para desbloquear",
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
          "Select Language": "اختر اللغة",
          Cancel: "إلغاء",
          "Select Currency": "اختر العملة",
          "Set Password": "تعيين كلمة المرور",
          "Only you can unlock your wallet": "يمكنك فقط فتح محفظتك",
          Password: "كلمة المرور",
          "Confirm Password": "تأكيد كلمة المرور",
          "Change Password": "تغيير كلمة المرور",
          "Default Currency": "العملة الافتراضية",
          "Help & Support": "المساعدة والدعم",
          "Privacy & Data": "الخصوصية والبيانات",
          About: "حول",
          Language: "اللغة",
          "Dark Mode": "الوضع الداكن",
          Bluetooth: "بلوتوث",
          "Pair with Bluetooth": "اقتران مع بلوتوث",
          "LOOKING FOR DEVICES": "البحث عن الأجهزة",
          "Scanning...": "جارٍ المسح...",
          "Please make sure your Cold Wallet is unlocked and Bluetooth is enabled.":
            "يرجى التأكد من أن محفظتك الباردة غير مقفلة وتم تمكين البلوتوث.",
          Send: "إرسال",
          "Send crypto to another wallet":
            "إرسال العملات الرقمية إلى محفظة أخرى",
          Receive: "استلام",
          "Receive crypto from another wallet":
            "استلام العملات الرقمية من محفظة أخرى",
          "Transaction History": "سجل المعاملات",
          "No Histories": "لا يوجد سجلات",
          "Enter the recipient's address:": "أدخل عنوان المستلم:",
          "Enter Address": "أدخل العنوان",
          Submit: "إرسال",
          Cancel: "إلغاء",
          "Choose the cryptocurrency to send:": "اختر العملة الرقمية لإرسالها:",
          "Choose the cryptocurrency to receive:":
            "اختر العملة الرقمية للاستلام:",
          "Address for": "العنوان لـ",
          Close: "إغلاق",
          Wallet: "محفظة",
          Transactions: "المعاملات",
          "My Cold Wallet": "LIKKIM الخاص بي",
          "Total Balance": "الرصيد الإجمالي",
          Balance: "الرصيد",
          "No cryptocurrencies available. Please add wallet first.":
            "لا توجد عملات مشفرة متاحة. يرجى إضافة المحفظة أولاً.",
          "This chain account will be removed": "سيتم إزالة حساب السلسلة هذا",
          "Remove Chain Account": "إزالة حساب السلسلة",
          Remove: "إزالة",
          "Security in your hands": "الأمان بين يديك",
          "LIKKIM supports 27 blockchains and over 10,000 cryptocurrencies.":
            "يدعم LIKKIM 27 سلسلة كتل وأكثر من 10,000 عملة مشفرة.",
          Continue: "متابعة",
          "Never share the recovery phrase.": "لا تشارك عبارة الاسترداد أبدًا.",
          "Please save the recovery phrase displayed on the LIKKIM hardware wallet screen.":
            "يرجى حفظ عبارة الاسترداد المعروضة على شاشة محفظة الأجهزة LIKKIM.",
          "Scroll down to view all words":
            "قم بالتمرير لأسفل لعرض جميع الكلمات",
          "Recovery Phrase": "عبارة الاسترداد",
          "Read the following, then save the phrase securely.":
            "اقرأ ما يلي ، ثم احفظ العبارة بأمان.",
          "The recovery phrase alone gives you full access to your wallets and funds.":
            "تمنحك عبارة الاسترداد وحدها الوصول الكامل إلى محافظك وأموالك.",
          "If you forget your password, you can use the recovery phrase to get back into your wallet.":
            "إذا نسيت كلمة المرور الخاصة بك ، يمكنك استخدام عبارة الاسترداد للعودة إلى محفظتك.",
          "LIKKIM will never ask for your recovery phrase.":
            "لن يطلب منك LIKKIM أبدًا عبارة الاسترداد الخاصة بك.",
          "Never share it with anyone.": "لا تشاركها أبدًا مع أي شخص.",
          "You must select all 12 words before you can proceed.":
            "يجب عليك تحديد جميع الكلمات الـ 12 قبل المتابعة.",
          "Verify and I've Saved the Phrase": "تحقق وقد قمت بحفظ العبارة",
          "Creating your wallet": "إنشاء محفظتك",
          "Generating your accounts": "إنشاء حساباتك",
          "Encrypting your data": "تشفير بياناتك",
          "Your wallet is now ready": "محفظتك جاهزة الآن",
          "Let's Go": "هيا بنا",
          "Use spaces between words": "استخدم مسافات بين الكلمات",
          "Import Recovery Phrase": "استيراد عبارة الاسترداد",
          Version: "الإصدار",
          "Only you can unlock your wallet": "فقط يمكنك فتح محفظتك",
          "Assets can only be sent within the same chain.":
            "يمكن إرسال الأصول فقط ضمن نفس السلسلة.",
          "Firmware Update": "تحديث البرنامج الثابت",
          "Sync balances to LIKKIM coldwallet":
            "مزامنة الأرصدة مع محفظة LIKKIM الباردة",
          "No data available": "لا توجد بيانات متاحة",
          "Search Currency": "البحث عن عملة",
          "Search Cryptocurrency": "البحث عن عملة مشفرة",
          "Select Currency": "اختر العملة",
          "Enable Screen Lock": "تفعيل قفل الشاشة",
          "Enter new password": "أدخل كلمة مرور جديدة",
          "Confirm new password": "تأكيد كلمة المرور الجديدة",
          "Change App Screen Lock Password": "تغيير كلمة مرور قفل الشاشة",
          "Disable Lock Screen": "تعطيل قفل الشاشة",
          "Enter your password": "أدخل كلمة المرور الخاصة بك",
          "Enter Password to Unlock": "أدخل كلمة المرور لفتح القفل",
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
          "Select Language": "言語を選択",
          Cancel: "キャンセル",
          "Select Currency": "通貨を選択",
          "Set Password": "パスワードを設定する",
          "Only you can unlock your wallet":
            "ウォレットをアンロックできるのはあなただけです",
          Password: "パスワード",
          "Confirm Password": "パスワードを認証する",
          "Change Password": "パスワードを変更する",
          "Default Currency": "デフォルトの通貨",
          "Help & Support": "ヘルプとサポート",
          "Privacy & Data": "プライバシーとデータ",
          About: "約",
          Language: "言語",
          "Dark Mode": "ダークモード",
          Bluetooth: "ブルートゥース",
          "Pair with Bluetooth": "Bluetoothとペアリング",
          "LOOKING FOR DEVICES": "デバイスを探しています",
          "Scanning...": "スキャン中...",
          "Please make sure your Cold Wallet is unlocked and Bluetooth is enabled.":
            "コールドウォレットがロック解除され、Bluetoothが有効になっていることを確認してください。",
          Send: "Enviar",
          "Send crypto to another wallet":
            "Enviar criptomonedas a otro monedero",
          Receive: "Recibir",
          "Receive crypto from another wallet":
            "Recibir criptomonedas de otro monedero",
          "Transaction History": "Historial de transacciones",
          "No Histories": "No hay historiales",
          "Enter the recipient's address:":
            "Ingrese la dirección del destinatario:",
          "Enter Address": "Ingrese la dirección",
          Submit: "Enviar",
          "Choose the cryptocurrency to send:":
            "Elija la criptomoneda para enviar:",
          "Choose the cryptocurrency to receive:":
            "Elija la criptomoneda para recibir:",
          "Address for": "Dirección para",
          Wallet: "ウォレット",
          Transactions: "トランザクション",
          "My Cold Wallet": "私のLIKKIM",
          "Total Balance": "総残高",
          Balance: "残高",
          "No cryptocurrencies available. Please add wallet first.":
            "利用可能な暗号通貨はありません。まずウォレットを追加してください。",
          "This chain account will be removed":
            "このチェーンアカウントは削除されます",
          "Remove Chain Account": "チェーンアカウントを削除",
          Remove: "削除",
          "Security in your hands": "安全はあなたの手に",
          "LIKKIM supports 27 blockchains and over 10,000 cryptocurrencies.":
            "LIKKIMは27のブロックチェーンと10,000以上の暗号通貨をサポートしています。",
          Continue: "続行",
          "Never share the recovery phrase.":
            "リカバリーフレーズは絶対に共有しないでください。",
          "Please save the recovery phrase displayed on the LIKKIM hardware wallet screen.":
            "LIKKIMハードウェアウォレットの画面に表示されるリカバリーフレーズを保存してください。",
          "Scroll down to view all words":
            "すべての単語を見るには下にスクロールしてください",
          "Recovery Phrase": "リカバリーフレーズ",
          "Read the following, then save the phrase securely.":
            "以下を読んでからフレーズを安全に保存してください。",
          "The recovery phrase alone gives you full access to your wallets and funds.":
            "リカバリーフレーズだけであなたのウォレットと資金に完全にアクセスできます。",
          "If you forget your password, you can use the recovery phrase to get back into your wallet.":
            "パスワードを忘れた場合は、リカバリーフレーズを使用してウォレットに戻ることができます。",
          "LIKKIM will never ask for your recovery phrase.":
            "LIKKIM がリカバリーフレーズを尋ねることはありません。",
          "Never share it with anyone.": "誰とも共有しないでください。",
          "You must select all 12 words before you can proceed.":
            "続行するには12個の単語すべてを選択する必要があります。",
          "Verify and I've Saved the Phrase": "確認してフレーズを保存しました",
          "Creating your wallet": "ウォレットを作成中",
          "Generating your accounts": "アカウントを生成中",
          "Encrypting your data": "データを暗号化中",
          "Your wallet is now ready": "ウォレットの準備が整いました",
          "Let's Go": "始めましょう",
          "Use spaces between words": "単語の間にスペースを使用",
          "Import Recovery Phrase": "リカバリーフレーズをインポート",
          Version: "バージョン",
          "Only you can unlock your wallet":
            "あなたのみがウォレットを解除できます",
          "Assets can only be sent within the same chain.":
            "資産は同じチェーン内でのみ送信できます。",
          "Firmware Update": "تحديث البرنامج الثابت",
          "Sync balances to LIKKIM coldwallet":
            "مزامنة الأرصدة مع محفظة LIKKIM الباردة",
          "No data available": "データがありません",
          "Search Currency": "通貨を検索",
          "Search Cryptocurrency": "暗号通貨を検索",
          "Select Currency": "通貨を選択",
          "Enable Screen Lock": "画面ロックを有効にする",
          "Enter new password": "新しいパスワードを入力してください",
          "Confirm new password": "新しいパスワードを確認する",
          "Change App Screen Lock Password":
            "アプリの画面ロックパスワードを変更する",
          "Disable Lock Screen": "画面ロックを無効にする",
          "Enter your password": "パスワードを入力してください",
          "Enter Password to Unlock":
            "ロックを解除するにはパスワードを入力してください",
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
          "Select Language": "Выберите язык",
          Cancel: "Отмена",
          "Select Currency": "Выберите валюту",
          "Set Password": "Установить пароль",
          "Only you can unlock your wallet":
            "Только вы можете разблокировать свой кошелек",
          Password: "Пароль",
          "Confirm Password": "Подтвердить пароль",
          "Change Password": "Сменить пароль",
          "Default Currency": "Валюта по умолчанию",
          "Help & Support": "Помощь и поддержка",
          "Privacy & Data": "Конфиденциальность и данные",
          About: "О программе",
          Language: "Язык",
          "Dark Mode": "Темный режим",
          Bluetooth: "Bluetooth",
          "Pair with Bluetooth": "Пара с Bluetooth",
          "LOOKING FOR DEVICES": "ПОИСК УСТРОЙСТВ",
          "Scanning...": "Сканирование...",
          "Please make sure your Cold Wallet is unlocked and Bluetooth is enabled.":
            "Пожалуйста, убедитесь, что ваш Cold Wallet разблокирован и Bluetooth включен.",
          Send: "Enviar",
          "Send crypto to another wallet":
            "Enviar criptomonedas a otro monedero",
          Receive: "Recibir",
          "Receive crypto from another wallet":
            "Recibir criptomonedas de otro monedero",
          "Transaction History": "Historial de transacciones",
          "No Histories": "No hay historiales",
          "Enter the recipient's address:":
            "Ingrese la dirección del destinatario:",
          "Enter Address": "Ingrese la dirección",
          Submit: "Enviar",
          "Choose the cryptocurrency to send:":
            "Elija la criptomoneda para enviar:",
          "Choose the cryptocurrency to receive:":
            "Elija la criptomoneda para recibir:",
          "Address for": "Dirección para",
          Wallet: "Кошелек",
          Transactions: "Транзакции",
          "My Cold Wallet": "Мой LIKKIM",
          "Total Balance": "Общий баланс",
          Balance: "Баланс",
          "No cryptocurrencies available. Please add wallet first.":
            "Нет доступных криптовалют. Пожалуйста, сначала добавьте кошелек.",
          "This chain account will be removed":
            "Этот учетная запись цепочки будет удалена",
          "Remove Chain Account": "Удалить учетную запись цепочки",
          Remove: "Удалить",
          "Security in your hands": "Безопасность в ваших руках",
          "LIKKIM supports 27 blockchains and over 10,000 cryptocurrencies.":
            "LIKKIM поддерживает 27 блокчейнов и более 10 000 криптовалют.",
          Continue: "Продолжить",
          "Never share the recovery phrase.":
            "Никогда не делитесь фразой восстановления.",
          "Please save the recovery phrase displayed on the LIKKIM hardware wallet screen.":
            "Пожалуйста, сохраните фразу восстановления, отображаемую на экране аппаратного кошелька LIKKIM.",
          "Scroll down to view all words":
            "Прокрутите вниз, чтобы увидеть все слова",
          "Recovery Phrase": "Фраза восстановления",
          "Read the following, then save the phrase securely.":
            "Прочитайте следующее, затем сохраните фразу надежно.",
          "The recovery phrase alone gives you full access to your wallets and funds.":
            "Фраза восстановления дает полный доступ к вашим кошелькам и средствам.",
          "If you forget your password, you can use the recovery phrase to get back into your wallet.":
            "Если вы забудете свой пароль, вы можете использовать фразу восстановления для доступа к своему кошельку.",
          "LIKKIM will never ask for your recovery phrase.":
            "LIKKIM никогда не попросит вашу фразу восстановления.",
          "Never share it with anyone.": "Никогда не делитесь этим ни с кем.",
          "You must select all 12 words before you can proceed.":
            "Вы должны выбрать все 12 слов, прежде чем продолжить.",
          "Verify and I've Saved the Phrase": "Проверить и я сохранил фразу",
          "Creating your wallet": "Создание вашего кошелька",
          "Generating your accounts": "Создание ваших аккаунтов",
          "Encrypting your data": "Шифрование ваших данных",
          "Your wallet is now ready": "Ваш кошелек готов",
          "Let's Go": "Поехали",
          "Use spaces between words": "Используйте пробелы между словами",
          "Import Recovery Phrase": "Импортировать фразу восстановления",
          Version: "Версия",
          "Only you can unlock your wallet":
            "Только вы можете разблокировать свой кошелек",
          "Assets can only be sent within the same chain.":
            "Активы могут быть отправлены только в пределах одной цепочки.",
          "Firmware Update": "Обновление прошивки",
          "Sync balances to LIKKIM coldwallet":
            "Синхронизировать балансы с холодным кошельком LIKKIM",
          "No data available": "Данные недоступны",
          "Search Currency": "Поиск валюты",
          "Search Cryptocurrency": "Поиск криптовалюты",
          "Select Currency": "Выбрать валюту",
          "Enable Screen Lock": "Включить блокировку экрана",
          "Enter new password": "Введите новый пароль",
          "Confirm new password": "Подтвердите новый пароль",
          "Change App Screen Lock Password":
            "Изменить пароль блокировки экрана приложения",
          "Disable Lock Screen": "Отключить блокировку экрана",
          "Enter your password": "Введите ваш пароль",
          "Enter Password to Unlock": "Введите пароль для разблокировки",
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
          "Select Language": "언어 선택",
          Cancel: "취소",
          "Select Currency": "통화 선택",
          "Set Password": "비밀번호 설정",
          "Only you can unlock your wallet":
            "지갑을 잠금 해제할 수 있는 사람은 당신뿐입니다",
          Password: "비밀번호",
          "Confirm Password": "비밀번호 확인",
          "Change Password": "비밀번호 변경",
          "Default Currency": "기본 통화",
          "Help & Support": "도움말 및 지원",
          "Privacy & Data": "개인정보 및 데이터",
          About: "정보",
          Language: "언어",
          "Dark Mode": "다크 모드",
          Bluetooth: "블루투스",
          "Pair with Bluetooth": "Bluetooth와 페어링",
          "LOOKING FOR DEVICES": "장치 찾기",
          "Scanning...": "스캔 중...",
          "Please make sure your Cold Wallet is unlocked and Bluetooth is enabled.":
            "콜드 월렛이 잠금 해제되고 Bluetooth가 활성화되어 있는지 확인하십시오.",
          Send: "보내다",
          "Send crypto to another wallet": "다른 지갑으로 암호화폐 보내기",
          Receive: "받다",
          "Receive crypto from another wallet": "다른 지갑에서 암호화폐 받기",
          "Transaction History": "거래 내역",
          "No Histories": "기록 없음",
          "Enter the recipient's address:": "수신자의 주소를 입력하십시오:",
          "Enter Address": "주소를 입력하십시오",
          Submit: "제출",
          "Choose the cryptocurrency to send:": "보낼 암호화폐를 선택하십시오:",
          "Choose the cryptocurrency to receive:":
            "받을 암호화폐를 선택하십시오:",
          "Address for": "주소",
          Wallet: "지갑",
          Transactions: "거래",
          "My Cold Wallet": "내 LIKKIM",
          "Total Balance": "총 잔액",
          Balance: "잔액",
          "No cryptocurrencies available. Please add wallet first.":
            "사용 가능한 암호화폐가 없습니다. 먼저 지갑을 추가하십시오.",
          "This chain account will be removed": "이 체인 계정이 제거됩니다",
          "Remove Chain Account": "체인 계정 제거",
          Remove: "제거",
          "Security in your hands": "안전은 당신의 손안에 있습니다",
          "LIKKIM supports 27 blockchains and over 10,000 cryptocurrencies.":
            "LIKKIM은 27개의 블록체인과 10,000개 이상의 암호화폐를 지원합니다.",
          Continue: "계속",
          "Never share the recovery phrase.":
            "복구 구문을 절대 공유하지 마세요.",
          "Please save the recovery phrase displayed on the LIKKIM hardware wallet screen.":
            "LIKKIM 하드웨어 지갑 화면에 표시된 복구 구문을 저장하세요.",
          "Scroll down to view all words":
            "모든 단어를 보려면 아래로 스크롤하세요",
          "Recovery Phrase": "복구 구문",
          "Read the following, then save the phrase securely.":
            "다음을 읽고 구문을 안전하게 저장하세요.",
          "The recovery phrase alone gives you full access to your wallets and funds.":
            "복구 구문만으로도 지갑과 자금에 완전히 액세스할 수 있습니다.",
          "If you forget your password, you can use the recovery phrase to get back into your wallet.":
            "비밀번호를 잊어버린 경우 복구 구문을 사용하여 지갑에 다시 액세스할 수 있습니다.",
          "LIKKIM will never ask for your recovery phrase.":
            "LIKKIM은 복구 구문을 묻지 않습니다.",
          "Never share it with anyone.": "절대 다른 사람과 공유하지 마십시오.",
          "You must select all 12 words before you can proceed.":
            "계속하려면 12개의 단어를 모두 선택해야 합니다.",
          "Verify and I've Saved the Phrase": "확인하고 구문을 저장했습니다",
          "Creating your wallet": "지갑 생성 중",
          "Generating your accounts": "계정 생성 중",
          "Encrypting your data": "데이터 암호화 중",
          "Your wallet is now ready": "지갑이 준비되었습니다",
          "Let's Go": "시작합시다",
          "Use spaces between words": "단어 사이에 공백 사용",
          "Import Recovery Phrase": "복구 구문 가져오기",
          Version: "버전",
          "Only you can unlock your wallet":
            "지갑을 잠금 해제할 수 있는 사람은 당신뿐입니다",
          "Assets can only be sent within the same chain.":
            "자산은 동일한 체인 내에서만 전송할 수 있습니다.",
          "Firmware Update": "펌웨어 업데이트",
          "Sync balances to LIKKIM coldwallet":
            "LIKKIM 콜드 월렛으로 잔액 동기화",
          "No data available": "데이터가 없습니다",
          "Search Currency": "통화 검색",
          "Search Cryptocurrency": "암호화폐 검색",
          "Select Currency": "통화 선택",
          "Enable Screen Lock": "화면 잠금 활성화",
          "Enter new password": "새 비밀번호 입력",
          "Confirm new password": "새 비밀번호 확인",
          "Change App Screen Lock Password": "앱 화면 잠금 비밀번호 변경",
          "Disable Lock Screen": "화면 잠금 해제",
          "Enter your password": "비밀번호를 입력하세요",
          "Enter Password to Unlock": "잠금을 해제하려면 비밀번호를 입력하세요",
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
          "Select Language": "Selecionar idioma",
          Cancel: "Cancelar",
          "Select Currency": "Selecionar moeda",
          "Set Password": "Definir senha",
          "Only you can unlock your wallet":
            "Somente você pode desbloquear sua carteira",
          Password: "Senha",
          "Confirm Password": "Confirmar senha",
          "Change Password": "Alterar senha",
          "Default Currency": "Moeda padrão",
          "Help & Support": "Ajuda e suporte",
          "Privacy & Data": "Privacidade e dados",
          About: "Sobre",
          Language: "Idioma",
          "Dark Mode": "Modo escuro",
          Bluetooth: "Bluetooth",
          "Pair with Bluetooth": "Emparelhar com Bluetooth",
          "LOOKING FOR DEVICES": "PROCURANDO DISPOSITIVOS",
          "Scanning...": "Digitalizando...",
          "Please make sure your Cold Wallet is unlocked and Bluetooth is enabled.":
            "Certifique-se de que sua Cold Wallet esteja desbloqueada e o Bluetooth esteja ativado.",
          Send: "Enviar",
          "Send crypto to another wallet":
            "Enviar criptomoeda para outra carteira",
          Receive: "Receber",
          "Receive crypto from another wallet":
            "Receber criptomoeda de outra carteira",
          "Transaction History": "Histórico de transações",
          "No Histories": "Sem históricos",
          "Enter the recipient's address:":
            "Insira o endereço do destinatário:",
          "Enter Address": "Insira o endereço",
          Submit: "Enviar",
          "Choose the cryptocurrency to send:":
            "Escolha a criptomoeda para enviar:",
          "Choose the cryptocurrency to receive:":
            "Escolha a criptomoeda para receber:",
          "Address for": "Endereço para",
          Wallet: "Carteira",
          Transactions: "Transações",
          "My Cold Wallet": "Meu LIKKIM",
          "Total Balance": "Saldo Total",
          Balance: "Saldo",
          "No cryptocurrencies available. Please add wallet first.":
            "Não há criptomoedas disponíveis. Por favor, adicione uma carteira primeiro.",
          "This chain account will be removed":
            "Esta conta de cadeia será removida",
          "Remove Chain Account": "Remover conta de cadeia",
          Remove: "Remover",
          "Security in your hands": "Segurança em suas mãos",
          "LIKKIM supports 27 blockchains and over 10,000 cryptocurrencies.":
            "A LIKKIM suporta 27 blockchains e mais de 10.000 criptomoedas.",
          Continue: "Continuar",
          "Never share the recovery phrase.":
            "Nunca compartilhe a frase de recuperação.",
          "Please save the recovery phrase displayed on the LIKKIM hardware wallet screen.":
            "Por favor, salve a frase de recuperação exibida na tela da carteira de hardware LIKKIM.",
          "Scroll down to view all words":
            "Role para baixo para ver todas as palavras",
          "Recovery Phrase": "Frase de recuperação",
          "Read the following, then save the phrase securely.":
            "Leia o seguinte e salve a frase com segurança.",
          "The recovery phrase alone gives you full access to your wallets and funds.":
            "A frase de recuperação sozinha dá-lhe acesso total às suas carteiras e fundos.",
          "If you forget your password, you can use the recovery phrase to get back into your wallet.":
            "Se você esquecer sua senha, pode usar a frase de recuperação para voltar à sua carteira.",
          "LIKKIM will never ask for your recovery phrase.":
            "A LIKKIM nunca pedirá sua frase de recuperação.",
          "Never share it with anyone.": "Nunca compartilhe com ninguém.",
          "You must select all 12 words before you can proceed.":
            "Você deve selecionar todas as 12 palavras antes de prosseguir.",
          "Verify and I've Saved the Phrase": "Verifique e eu salvei a frase",
          "Creating your wallet": "Criando sua carteira",
          "Generating your accounts": "Gerando suas contas",
          "Encrypting your data": "Criptografando seus dados",
          "Your wallet is now ready": "Sua carteira está pronta",
          "Let's Go": "Vamos lá",
          "Use spaces between words": "Use espaços entre as palavras",
          "Import Recovery Phrase": "Importar Frase de Recuperação",
          Version: "Versão",
          "Only you can unlock your wallet":
            "Apenas você pode desbloquear sua carteira",
          "Assets can only be sent within the same chain.":
            "Os ativos só podem ser enviados dentro da mesma cadeia.",
          "Firmware Update": "Atualização de firmware",
          "Sync balances to LIKKIM coldwallet":
            "Sincronizar saldos com a carteira fria LIKKIM",
          "No data available": "Nenhum dado disponível",
          "Search Currency": "Pesquisar moeda",
          "Search Cryptocurrency": "Pesquisar criptomoeda",
          "Select Currency": "Selecionar moeda",
          "Enable Screen Lock": "Ativar bloqueio de tela",
          "Enter new password": "Digite a nova senha",
          "Confirm new password": "Confirme a nova senha",
          "Change App Screen Lock Password":
            "Alterar senha de bloqueio de tela do aplicativo",
          "Disable Lock Screen": "Desativar bloqueio de tela",
          "Enter your password": "Digite sua senha",
          "Enter Password to Unlock": "Digite a senha para desbloquear",
        },
      },
      "pt-BR": {
        translation: {
          "Add Wallet": "Adicionar carteira",
          "Create Wallet": "Criar carteira",
          "Import Wallet": "Importar carteira",
          Close: "Fechar",
          "Value:": "Valor:",
          "Delete Card": "Excluir cartão",
          "Select Language": "Selecionar idioma",
          Cancel: "Cancelar",
          "Select Currency": "Selecionar moeda",
          "Set Password": "Definir senha",
          "Only you can unlock your wallet":
            "Somente você pode desbloquear sua carteira",
          Password: "Senha",
          "Confirm Password": "Confirmar senha",
          "Change Password": "Alterar senha",
          "Default Currency": "Moeda padrão",
          "Help & Support": "Ajuda e suporte",
          "Privacy & Data": "Privacidade e dados",
          About: "Sobre",
          Language: "Idioma",
          "Dark Mode": "Modo escuro",
          Bluetooth: "Bluetooth",
          "Pair with Bluetooth": "Emparelhar com Bluetooth",
          "LOOKING FOR DEVICES": "PROCURANDO DISPOSITIVOS",
          "Scanning...": "Digitalizando...",
          "Please make sure your Cold Wallet is unlocked and Bluetooth is enabled.":
            "Certifique-se de que sua Cold Wallet esteja desbloqueada e o Bluetooth esteja ativado.",
          Send: "Enviar",
          "Send crypto to another wallet":
            "Enviar criptomoeda para outra carteira",
          Receive: "Receber",
          "Receive crypto from another wallet":
            "Receber criptomoeda de outra carteira",
          "Transaction History": "Histórico de transações",
          "No Histories": "Nenhum histórico",
          "Enter the recipient's address:":
            "Digite o endereço do destinatário:",
          "Enter Address": "Digite o endereço",
          Submit: "Enviar",
          Cancel: "Cancelar",
          "Choose the cryptocurrency to send:":
            "Escolha a criptomoeda para enviar:",
          "Choose the cryptocurrency to receive:":
            "Escolha a criptomoeda para receber:",
          "Address for": "Endereço para",
          Close: "Fechar",
          Wallet: "Carteira",
          Transactions: "Transações",
          "My Cold Wallet": "Meu LIKKIM",
          "Total Balance": "Saldo Total",
          Balance: "Saldo",
          "No cryptocurrencies available. Please add wallet first.":
            "Não há criptomoedas disponíveis. Por favor, adicione uma carteira primeiro.",
          "This chain account will be removed":
            "Esta conta de cadeia será removida",
          "Remove Chain Account": "Remover conta de cadeia",
          Remove: "Remover",
          "Security in your hands": "Segurança em suas mãos",
          "LIKKIM supports 27 blockchains and over 10,000 cryptocurrencies.":
            "A LIKKIM suporta 27 blockchains e mais de 10.000 criptomoedas.",
          Continue: "Continuar",
          "Never share the recovery phrase.":
            "Nunca compartilhe a frase de recuperação.",
          "Please save the recovery phrase displayed on the LIKKIM hardware wallet screen.":
            "Por favor, salve a frase de recuperação exibida na tela da carteira de hardware LIKKIM.",
          "Scroll down to view all words":
            "Role para baixo para ver todas as palavras",
          "Recovery Phrase": "Frase de recuperação",
          "Read the following, then save the phrase securely.":
            "Leia o seguinte e salve a frase com segurança.",
          "The recovery phrase alone gives you full access to your wallets and funds.":
            "A frase de recuperação sozinha dá-lhe acesso total às suas carteiras e fundos.",
          "If you forget your password, you can use the recovery phrase to get back into your wallet.":
            "Se você esquecer sua senha, pode usar a frase de recuperação para voltar à sua carteira.",
          "LIKKIM will never ask for your recovery phrase.":
            "A LIKKIM nunca pedirá sua frase de recuperação.",
          "Never share it with anyone.": "Nunca compartilhe com ninguém.",
          "You must select all 12 words before you can proceed.":
            "Você deve selecionar todas as 12 palavras antes de prosseguir.",
          "Verify and I've Saved the Phrase": "Verifique e eu salvei a frase",
          "Creating your wallet": "Criando sua carteira",
          "Generating your accounts": "Gerando suas contas",
          "Encrypting your data": "Criptografando seus dados",
          "Your wallet is now ready": "Sua carteira está pronta",
          "Let's Go": "Vamos lá",
          "Use spaces between words": "Use espaços entre as palavras",
          "Import Recovery Phrase": "Importar Frase de Recuperação",
          Version: "Versão",
          "Only you can unlock your wallet":
            "Apenas você pode desbloquear sua carteira",
          "Assets can only be sent within the same chain.":
            "Os ativos só podem ser enviados dentro da mesma cadeia.",
          "Firmware Update": "Atualização de firmware",
          "Sync balances to LIKKIM coldwallet":
            "Sincronizar saldos com a carteira fria LIKKIM",
          "No data available": "Nenhum dado disponível",
          "Search Currency": "Pesquisar moeda",
          "Search Cryptocurrency": "Pesquisar criptomoeda",
          "Select Currency": "Selecionar moeda",
          "Enable Screen Lock": "Ativar bloqueio de tela",
          "Enter new password": "Digite a nova senha",
          "Confirm new password": "Confirme a nova senha",
          "Change App Screen Lock Password":
            "Alterar senha de bloqueio de tela do aplicativo",
          "Disable Lock Screen": "Desativar bloqueio de tela",
          "Enter your password": "Digite sua senha",
          "Enter Password to Unlock": "Digite a senha para desbloquear",
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
          "Select Language": "Seleziona lingua",
          Cancel: "Annulla",
          "Select Currency": "Seleziona valuta",
          "Set Password": "Imposta password",
          "Only you can unlock your wallet":
            "Solo tu puoi sbloccare il tuo portafoglio",
          Password: "Password",
          "Confirm Password": "Conferma password",
          "Change Password": "Cambia password",
          "Default Currency": "Valuta predefinita",
          "Help & Support": "Aiuto e supporto",
          "Privacy & Data": "Privacy e dati",
          About: "Informazioni",
          Language: "Lingua",
          "Dark Mode": "Modalità scura",
          Bluetooth: "Bluetooth",
          "Pair with Bluetooth": "Abbina con Bluetooth",
          "LOOKING FOR DEVICES": "RICERCA DI DISPOSITIVI",
          "Scanning...": "Scansione...",
          "Please make sure your Cold Wallet is unlocked and Bluetooth is enabled.":
            "Assicurati che il tuo Cold Wallet sia sbloccato e che il Bluetooth sia abilitato.",
          Send: "Inviare",
          "Send crypto to another wallet":
            "Invia criptovaluta a un altro portafoglio",
          Receive: "Ricevere",
          "Receive crypto from another wallet":
            "Ricevi criptovaluta da un altro portafoglio",
          "Transaction History": "Cronologia delle transazioni",
          "No Histories": "Nessuna cronologia",
          "Enter the recipient's address:":
            "Inserisci l'indirizzo del destinatario:",
          "Enter Address": "Inserisci l'indirizzo",
          Submit: "Invia",
          Cancel: "Annulla",
          "Choose the cryptocurrency to send:":
            "Scegli la criptovaluta da inviare:",
          "Choose the cryptocurrency to receive:":
            "Scegli la criptovaluta da ricevere:",
          "Address for": "Indirizzo per",
          Close: "Chiudi",
          Wallet: "Portafoglio",
          Transactions: "Transazioni",
          "My Cold Wallet": "Il mio LIKKIM",
          "Total Balance": "Saldo Totale",
          Balance: "Saldo",
          "No cryptocurrencies available. Please add wallet first.":
            "Nessuna criptovaluta disponibile. Si prega di aggiungere prima un portafoglio.",
          "This chain account will be removed":
            "Questo account di catena verrà rimosso",
          "Remove Chain Account": "Rimuovere account di catena",
          Remove: "Rimuovere",
          "Security in your hands": "Sicurezza nelle tue mani",
          "LIKKIM supports 27 blockchains and over 10,000 cryptocurrencies.":
            "LIKKIM supporta 27 blockchain e oltre 10.000 criptovalute.",
          Continue: "Continua",
          "Never share the recovery phrase.":
            "Non condividere mai la frase di recupero.",
          "Please save the recovery phrase displayed on the LIKKIM hardware wallet screen.":
            "Si prega di salvare la frase di recupero visualizzata sullo schermo del portafoglio hardware LIKKIM.",
          "Scroll down to view all words":
            "Scorri verso il basso per visualizzare tutte le parole",
          "Recovery Phrase": "Frase di recupero",
          "Read the following, then save the phrase securely.":
            "Leggi quanto segue, quindi salva la frase in modo sicuro.",
          "The recovery phrase alone gives you full access to your wallets and funds.":
            "La frase di recupero da sola ti dà pieno accesso ai tuoi portafogli e fondi.",
          "If you forget your password, you can use the recovery phrase to get back into your wallet.":
            "Se dimentichi la tua password, puoi utilizzare la frase di recupero per rientrare nel tuo portafoglio.",
          "LIKKIM will never ask for your recovery phrase.":
            "LIKKIM non chiederà mai la tua frase di recupero.",
          "Never share it with anyone.": "Non condividerlo mai con nessuno.",
          "You must select all 12 words before you can proceed.":
            "Devi selezionare tutte le 12 parole prima di procedere.",
          "Verify and I've Saved the Phrase": "Verifica e ho salvato la frase",
          "Creating your wallet": "Creazione del tuo portafoglio",
          "Generating your accounts": "Generazione dei tuoi account",
          "Encrypting your data": "Criptazione dei tuoi dati",
          "Your wallet is now ready": "Il tuo portafoglio è pronto",
          "Let's Go": "Andiamo",
          "Use spaces between words": "Usa spazi tra le parole",
          "Import Recovery Phrase": "Importa Frase di Recupero",
          Version: "Versione",
          "Only you can unlock your wallet":
            "Solo tu puoi sbloccare il tuo portafoglio",
          "Assets can only be sent within the same chain.":
            "Gli asset possono essere inviati solo all'interno della stessa catena.",
          "Firmware Update": "Aggiornamento firmware",
          "Sync balances to LIKKIM coldwallet":
            "Sincronizza saldi con il portafoglio freddo LIKKIM",
          "No data available": "Nessun dato disponibile",
          "Search Currency": "Cerca valuta",
          "Search Cryptocurrency": "Cerca criptovaluta",
          "Select Currency": "Seleziona valuta",
          "Enable Screen Lock": "Abilita blocco schermo",
          "Enter new password": "Inserisci nuova password",
          "Confirm new password": "Conferma nuova password",
          "Change App Screen Lock Password":
            "Cambia la password del blocco schermo dell'app",
          "Disable Lock Screen": "Disabilita blocco schermo",
          "Enter your password": "Inserisci la tua password",
          "Enter Password to Unlock": "Inserisci la password per sbloccare",
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
          "Select Language": "Sprache auswählen",
          Cancel: "Abbrechen",
          "Select Currency": "Währung auswählen",
          "Set Password": "Passwort festlegen",
          "Only you can unlock your wallet":
            "Nur Sie können Ihre Brieftasche entsperren",
          Password: "Passwort",
          "Confirm Password": "Passwort bestätigen",
          "Change Password": "Passwort ändern",
          "Default Currency": "Standardwährung",
          "Help & Support": "Hilfe & Support",
          "Privacy & Data": "Datenschutz & Daten",
          About: "Über",
          Language: "Sprache",
          "Dark Mode": "Dunkler Modus",
          Bluetooth: "Bluetooth",
          "Pair with Bluetooth": "Mit Bluetooth koppeln",
          "LOOKING FOR DEVICES": "SUCHEN NACH GERÄTEN",
          "Scanning...": "Scannen...",
          "Please make sure your Cold Wallet is unlocked and Bluetooth is enabled.":
            "Bitte stellen Sie sicher, dass Ihre Cold Wallet entsperrt und Bluetooth aktiviert ist.",
          Send: "Senden",
          "Send crypto to another wallet":
            "Kryptowährung an eine andere Brieftasche senden",
          Receive: "Empfangen",
          "Receive crypto from another wallet":
            "Kryptowährung von einer anderen Brieftasche empfangen",
          "Transaction History": "Transaktionsverlauf",
          "No Histories": "Keine Verlaufsdaten",
          "Enter the recipient's address:":
            "Geben Sie die Adresse des Empfängers ein:",
          "Enter Address": "Adresse eingeben",
          Submit: "Einreichen",
          Cancel: "Abbrechen",
          "Choose the cryptocurrency to send:":
            "Wählen Sie die zu sendende Kryptowährung:",
          "Choose the cryptocurrency to receive:":
            "Wählen Sie die zu empfangende Kryptowährung:",
          "Address for": "Adresse für",
          Close: "Schließen",
          Wallet: "Brieftasche",
          Transactions: "Transaktionen",
          "My Cold Wallet": "Mein LIKKIM",
          "Total Balance": "Gesamtsaldo",
          Balance: "Guthaben",
          "No cryptocurrencies available. Please add wallet first.":
            "Keine Kryptowährungen verfügbar. Bitte fügen Sie zuerst eine Brieftasche hinzu.",
          "This chain account will be removed":
            "Dieses Kettenkonto wird entfernt",
          "Remove Chain Account": "Kettenkonto entfernen",
          Remove: "Entfernen",
          "Security in your hands": "Sicherheit in Ihren Händen",
          "LIKKIM supports 27 blockchains and over 10,000 cryptocurrencies.":
            "LIKKIM unterstützt 27 Blockchains und über 10.000 Kryptowährungen.",
          Continue: "Fortsetzen",
          "Never share the recovery phrase.":
            "Teilen Sie niemals die Wiederherstellungsphrase.",
          "Please save the recovery phrase displayed on the LIKKIM hardware wallet screen.":
            "Bitte speichern Sie die Wiederherstellungsphrase, die auf dem Bildschirm der LIKKIM-Hardware-Wallet angezeigt wird.",
          "Scroll down to view all words":
            "Scrollen Sie nach unten, um alle Wörter zu sehen",
          "Recovery Phrase": "Wiederherstellungsphrase",
          "Read the following, then save the phrase securely.":
            "Lesen Sie das Folgende und speichern Sie die Phrase sicher.",
          "The recovery phrase alone gives you full access to your wallets and funds.":
            "Die Wiederherstellungsphrase allein gibt Ihnen vollen Zugriff auf Ihre Wallets und Gelder.",
          "If you forget your password, you can use the recovery phrase to get back into your wallet.":
            "Wenn Sie Ihr Passwort vergessen, können Sie die Wiederherstellungsphrase verwenden, um wieder auf Ihre Wallet zuzugreifen.",
          "LIKKIM will never ask for your recovery phrase.":
            "LIKKIM wird niemals nach Ihrer Wiederherstellungsphrase fragen.",
          "Never share it with anyone.": "Teilen Sie es niemals mit jemandem.",
          "You must select all 12 words before you can proceed.":
            "Sie müssen alle 12 Wörter auswählen, bevor Sie fortfahren können.",
          "Verify and I've Saved the Phrase":
            "Überprüfen und ich habe die Phrase gespeichert",
          "Creating your wallet": "Erstellen Ihrer Brieftasche",
          "Generating your accounts": "Erstellen Ihrer Konten",
          "Encrypting your data": "Verschlüsseln Ihrer Daten",
          "Your wallet is now ready": "Ihre Brieftasche ist jetzt bereit",
          "Let's Go": "Los geht's",
          "Use spaces between words":
            "Verwenden Sie Leerzeichen zwischen den Wörtern",
          "Import Recovery Phrase": "Wiederherstellungsphrase importieren",
          Version: "Version",
          "Only you can unlock your wallet":
            "Nur du kannst dein Wallet entsperren",
          "Assets can only be sent within the same chain.":
            "Vermögenswerte können nur innerhalb derselben Kette gesendet werden.",
          "Firmware Update": "Firmware-Aktualisierung",
          "Sync balances to LIKKIM coldwallet":
            "Salden mit LIKKIM Cold Wallet synchronisieren",
          "No data available": "Keine Daten verfügbar",
          "Search Currency": "Währung suchen",
          "Search Cryptocurrency": "Kryptowährung suchen",
          "Select Currency": "Währung auswählen",
          "Enable Screen Lock": "Bildschirmsperre aktivieren",
          "Enter new password": "Neues Passwort eingeben",
          "Confirm new password": "Neues Passwort bestätigen",
          "Change App Screen Lock Password":
            "App-Bildschirmsperren-Passwort ändern",
          "Disable Lock Screen": "Bildschirmsperre deaktivieren",
          "Enter your password": "Geben Sie Ihr Passwort ein",
          "Enter Password to Unlock": "Passwort eingeben, um zu entsperren",
        },
      },
      hi: {
        translation: {
          "Add Wallet": "वॉलेट जोड़ें",
          "Create Wallet": "वॉलेट बनाएँ",
          "Import Wallet": "वॉलेट आयात करें",
          Close: "बंद करें",
          "Value:": "मूल्य:",
          "Delete Card": "कार्ड हटाएं",
          "Select Language": "भाषा चुनें",
          Cancel: "रद्द करें",
          "Select Currency": "मुद्रा चुनें",
          "Set Password": "पासवर्ड सेट करें",
          "Only you can unlock your wallet":
            "केवल आप ही अपने वॉलेट को अनलॉक कर सकते हैं",
          Password: "पासवर्ड",
          "Confirm Password": "पासवर्ड की पुष्टि करें",
          "Change Password": "पासवर्ड बदलें",
          "Default Currency": "डिफ़ॉल्ट मुद्रा",
          "Help & Support": "सहायता और समर्थन",
          "Privacy & Data": "गोपनीयता और डेटा",
          About: "के बारे में",
          Language: "भाषा",
          "Dark Mode": "डार्क मोड",
          Bluetooth: "ब्लूटूथ",
          "Pair with Bluetooth": "ब्लूटूथ के साथ पेयर करें",
          "LOOKING FOR DEVICES": "डिवाइस खोज रहे हैं",
          "Scanning...": "स्कैनिंग...",
          "Please make sure your Cold Wallet is unlocked and Bluetooth is enabled.":
            "कृपया सुनिश्चित करें कि आपका कोल्ड वॉलेट अनलॉक है और ब्लूटूथ सक्षम है।",
          Send: "भेजें",
          "Send crypto to another wallet": "दूसरे वॉलेट में क्रिप्टो भेजें",
          Receive: "प्राप्त करें",
          "Receive crypto from another wallet":
            "दूसरे वॉलेट से क्रिप्टो प्राप्त करें",
          "Transaction History": "लेन-देन का इतिहास",
          "No Histories": "कोई इतिहास नहीं",
          "Enter the recipient's address:": "प्राप्तकर्ता का पता दर्ज करें:",
          "Enter Address": "पता दर्ज करें",
          Submit: "जमा करें",
          Cancel: "रद्द करें",
          "Choose the cryptocurrency to send:":
            "भेजने के लिए क्रिप्टोकरेंसी चुनें:",
          "Choose the cryptocurrency to receive:":
            "प्राप्त करने के लिए क्रिप्टोकरेंसी चुनें:",
          "Address for": "के लिए पता",
          Close: "बंद करें",
          Wallet: "बटुआ",
          Transactions: "लेनदेन",
          "My Cold Wallet": "मेरा LIKKIM",
          "Total Balance": "कुल शेष राशि",
          Balance: "शेष",
          "No cryptocurrencies available. Please add wallet first.":
            "कोई क्रिप्टोकरेंसी उपलब्ध नहीं है। कृपया पहले वॉलेट जोड़ें।",
          "This chain account will be removed":
            "यह श्रृंखला खाता हटा दिया जाएगा",
          "Remove Chain Account": "श्रृंखला खाता हटाएं",
          Remove: "हटाएं",
          "Security in your hands": "सुरक्षा आपके हाथ में",
          "LIKKIM supports 27 blockchains and over 10,000 cryptocurrencies.":
            "LIKKIM 27 ब्लॉकचेन और 10,000 से अधिक क्रिप्टोकरेंसी का समर्थन करता है।",
          Continue: "जारी रखें",
          "Never share the recovery phrase.":
            "रिकवरी वाक्यांश को कभी साझा न करें।",
          "Please save the recovery phrase displayed on the LIKKIM hardware wallet screen.":
            "कृपया LIKKIM हार्डवेयर वॉलेट स्क्रीन पर प्रदर्शित रिकवरी वाक्यांश को सहेजें।",
          "Scroll down to view all words":
            "सभी शब्दों को देखने के लिए नीचे स्क्रॉल करें",
          "Recovery Phrase": "रिकवरी वाक्यांश",
          "Read the following, then save the phrase securely.":
            "निम्नलिखित पढ़ें, फिर वाक्यांश को सुरक्षित रूप से सहेजें।",
          "The recovery phrase alone gives you full access to your wallets and funds.":
            "रिकवरी वाक्यांश अकेले आपको आपके वॉलेट और फंड तक पूरी पहुंच प्रदान करता है।",
          "If you forget your password, you can use the recovery phrase to get back into your wallet.":
            "यदि आप अपना पासवर्ड भूल जाते हैं, तो आप अपने वॉलेट में वापस आने के लिए रिकवरी वाक्यांश का उपयोग कर सकते हैं।",
          "LIKKIM will never ask for your recovery phrase.":
            "LIKKIM कभी भी आपसे आपका रिकवरी वाक्यांश नहीं पूछेगा।",
          "Never share it with anyone.": "इसे कभी भी किसी के साथ साझा न करें।",
          "You must select all 12 words before you can proceed.":
            "आगे बढ़ने से पहले आपको सभी 12 शब्दों का चयन करना होगा।",
          "Verify and I've Saved the Phrase":
            "सत्यापित करें और मैंने वाक्यांश सहेज लिया है",
          "Creating your wallet": "आपका वॉलेट बना रहा है",
          "Generating your accounts": "आपके खाते बना रहा है",
          "Encrypting your data": "आपका डेटा एन्क्रिप्ट कर रहा है",
          "Your wallet is now ready": "आपका वॉलेट अब तैयार है",
          "Let's Go": "चलिए चलते हैं",
          "Use spaces between words": "शब्दों के बीच स्पेस का उपयोग करें",
          "Import Recovery Phrase": "रिकवरी वाक्यांश आयात करें",
          Version: "संस्करण",
          "Only you can unlock your wallet":
            "केवल आप ही अपना बटुआ अनलॉक कर सकते हैं",
          "Assets can only be sent within the same chain.":
            "संपत्तियां केवल उसी श्रृंखला के भीतर भेजी जा सकती हैं।",
          "Firmware Update": "फर्मवेयर अपडेट",
          "Sync balances to LIKKIM coldwallet":
            "LIKKIM कोल्डवॉलेट में बैलेंस सिंक करें",
          "No data available": "कोई डेटा उपलब्ध नहीं है",
          "Search Currency": "मुद्रा खोजें",
          "Search Cryptocurrency": "क्रिप्टोकरेंसी खोजें",
          "Select Currency": "मुद्रा चुनें",
          "Enable Screen Lock": "स्क्रीन लॉक सक्षम करें",
          "Enter new password": "नया पासवर्ड दर्ज करें",
          "Confirm new password": "नया पासवर्ड पुष्टि करें",
          "Change App Screen Lock Password": "ऐप स्क्रीन लॉक पासवर्ड बदलें",
          "Disable Lock Screen": "स्क्रीन लॉक अक्षम करें",
          "Enter your password": "अपना पासवर्ड दर्ज करें",
          "Enter Password to Unlock": "अनलॉक करने के लिए पासवर्ड दर्ज करें",
        },
      },
      mn: {
        translation: {
          "Add Wallet": "Хэтэвч нэмэх",
          "Create Wallet": "Хэтэвч үүсгэх",
          "Import Wallet": "Хэтэвч импортлох",
          Close: "Хаах",
          "Value:": "Үнэ цэнэ:",
          "Delete Card": "Карт устгах",
          "Select Language": "Хэл сонгох",
          Cancel: "Цуцлах",
          "Select Currency": "Валют сонгох",
          "Set Password": "Нууц үг тохируулах",
          "Only you can unlock your wallet":
            "Таны хэтэвчийг зөвхөн та л тайлна",
          Password: "Нууц үг",
          "Confirm Password": "Нууц үг батлах",
          "Change Password": "Нууц үг солих",
          "Default Currency": "Үндсэн валют",
          "Help & Support": "Тусламж ба дэмжлэг",
          "Privacy & Data": "Нууцлал ба мэдээлэл",
          About: "Тухай",
          Language: "Хэл",
          "Dark Mode": "Харанхуй горим",
          Bluetooth: "Bluetooth",
          "Pair with Bluetooth": "Bluetooth-тэй хослуулах",
          "LOOKING FOR DEVICES": "Төхөөрөмж хайж байна",
          "Scanning...": "Сканнердах...",
          "Please make sure your Cold Wallet is unlocked and Bluetooth is enabled.":
            "Таны хүйтэн хэтэвч тайлагдсан, Bluetooth асаалттай байгаа эсэхийг шалгана уу.",
          Send: "Илгээх",
          "Send crypto to another wallet":
            "Криптовалютыг өөр түрийвчинд илгээх",
          Receive: "Хүлээн авах",
          "Receive crypto from another wallet":
            "Криптовалютыг өөр түрийвчээс хүлээн авах",
          "Transaction History": "Гүйлгээний түүх",
          "No Histories": "Түүх байхгүй",
          "Enter the recipient's address:":
            "Хүлээн авагчийн хаягийг оруулна уу:",
          "Enter Address": "Хаяг оруулах",
          Submit: "Илгээх",
          Cancel: "Цуцлах",
          "Choose the cryptocurrency to send:":
            "Илгээх криптовалютыг сонгоно уу:",
          "Choose the cryptocurrency to receive:":
            "Хүлээн авах криптовалютыг сонгоно уу:",
          "Address for": "Хаяг",
          Close: "Хаах",
          Wallet: "Хэтэвч",
          Transactions: "Гүйлгээ",
          "My Cold Wallet": "Миний LIKKIM",
          "Total Balance": "Нийт үлдэгдэл",
          Balance: "Үлдэгдэл",
          "No cryptocurrencies available. Please add wallet first.":
            "Криптовалют байхгүй байна. Эхлээд түрийвч нэмнэ үү.",
          "This chain account will be removed": "Энэ гинжний дансыг устгана",
          "Remove Chain Account": "Гинжний дансыг устгах",
          Remove: "Устгах",
          "Security in your hands": "Аюулгүй байдал таны гарт",
          "LIKKIM supports 27 blockchains and over 10,000 cryptocurrencies.":
            "LIKKIM 27 блокчэйн болон 10,000 гаруй криптовалютыг дэмждэг.",
          Continue: "Үргэлжлүүлэх",
          "Never share the recovery phrase.":
            "Сэргээх үгийг хэзээ ч бүү хуваалцаарай.",
          "Please save the recovery phrase displayed on the LIKKIM hardware wallet screen.":
            "LIKKIM техник хангамжийн түрийвчний дэлгэц дээрх сэргээх үгийг хадгалаарай.",
          "Scroll down to view all words":
            "Бүх үгийг харахын тулд доош гүйлгэнэ үү",
          "Recovery Phrase": "Сэргээх үг",
          "Read the following, then save the phrase securely.":
            "Дараахыг уншаад үгээ аюулгүй хадгална уу.",
          "The recovery phrase alone gives you full access to your wallets and funds.":
            "Сэргээх үг дангаараа таны түрийвч болон хөрөнгөд бүрэн нэвтрэх боломжийг олгоно.",
          "If you forget your password, you can use the recovery phrase to get back into your wallet.":
            "Хэрэв та нууц үгээ мартсан бол сэргээх үгийг ашиглан түрийвчээ дахин ашиглаж болно.",
          "LIKKIM will never ask for your recovery phrase.":
            "LIKKIM таны сэргээх үгийг хэзээ ч асуухгүй.",
          "Never share it with anyone.": "Хэнтэй ч битгий хуваалцаарай.",
          "You must select all 12 words before you can proceed.":
            "Та үргэлжлүүлэхийн өмнө бүх 12 үгийг сонгох ёстой.",
          "Verify and I've Saved the Phrase":
            "Баталгаажуулж, би үгийг хадгалсан",
          "Creating your wallet": "Таны түрийвчийг үүсгэж байна",
          "Generating your accounts": "Таны акаунтуудыг үүсгэж байна",
          "Encrypting your data": "Таны өгөгдлийг шифрлэж байна",
          "Your wallet is now ready": "Таны түрийвч одоо бэлэн боллоо",
          "Let's Go": "Эхэлцгээе",
          "Use spaces between words": "Үгсийн хооронд зай ашигла",
          "Import Recovery Phrase": "Сэргээх үгийг импортлох",
          Version: "Хувилбар",
          "Only you can unlock your wallet":
            "Зөвхөн та өөрийн түрийвчээ онгойлгож чадна",
          "Assets can only be sent within the same chain.":
            "Хөрөнгийг зөвхөн нэг гинжин дотор л илгээх боломжтой.",
          "Firmware Update": "Фирмвэр шинэчлэх",
          "Sync balances to LIKKIM coldwallet":
            "LIKKIM хүйтэн түрийвчтэй тэнцвэрийг синк хийх",
          "No data available": "Мэдээлэл байхгүй",
          "Search Currency": "Валют хайх",
          "Search Cryptocurrency": "Криптовалют хайх",
          "Select Currency": "Валют сонгох",
          "Enable Screen Lock": "Дэлгэцийн түгжээг идэвхжүүлэх",
          "Enter new password": "Шинэ нууц үгээ оруулна уу",
          "Confirm new password": "Шинэ нууц үгээ баталгаажуулна уу",
          "Change App Screen Lock Password": "Аппын дэлгэцийн түгжээг өөрчлөх",
          "Disable Lock Screen": "Дэлгэцийн түгжээг идэвхгүй болгох",
          "Enter your password": "Нууц үгээ оруулна уу",
          "Enter Password to Unlock":
            "Түгжээг тайлахын тулд нууц үгээ оруулна уу",
        },
      },
      th: {
        translation: {
          "Add Wallet": "เพิ่มกระเป๋าเงิน",
          "Create Wallet": "สร้างกระเป๋าเงิน",
          "Import Wallet": "นำเข้ากระเป๋าเงิน",
          Close: "ปิด",
          "Value:": "มูลค่า:",
          "Delete Card": "ลบการ์ด",
          "Select Language": "เลือกภาษา",
          Cancel: "ยกเลิก",
          "Select Currency": "เลือกสกุลเงิน",
          "Set Password": "ตั้งรหัสผ่าน",
          "Only you can unlock your wallet":
            "มีเพียงคุณเท่านั้นที่สามารถปลดล็อคกระเป๋าเงินของคุณได้",
          Password: "รหัสผ่าน",
          "Confirm Password": "ยืนยันรหัสผ่าน",
          "Change Password": "เปลี่ยนรหัสผ่าน",
          "Default Currency": "สกุลเงินเริ่มต้น",
          "Help & Support": "ช่วยเหลือและสนับสนุน",
          "Privacy & Data": "ความเป็นส่วนตัวและข้อมูล",
          About: "เกี่ยวกับ",
          Language: "ภาษา",
          "Dark Mode": "โหมดมืด",
          Bluetooth: "Bluetooth",
          "Pair with Bluetooth": "จับคู่กับ Bluetooth",
          "LOOKING FOR DEVICES": "กำลังมองหาอุปกรณ์",
          "Scanning...": "กำลังสแกน...",
          "Please make sure your Cold Wallet is unlocked and Bluetooth is enabled.":
            "โปรดตรวจสอบให้แน่ใจว่ากระเป๋าเงินเย็นของคุณถูกปลดล็อกและเปิดใช้งาน Bluetooth แล้ว",
          Send: "ส่ง",
          "Send crypto to another wallet": "ส่งคริปโตไปยังวอลเล็ตอื่น",
          Receive: "รับ",
          "Receive crypto from another wallet": "รับคริปโตจากวอลเล็ตอื่น",
          "Transaction History": "ประวัติการทำธุรกรรม",
          "No Histories": "ไม่มีประวัติ",
          "Enter the recipient's address:": "ป้อนที่อยู่ผู้รับ:",
          "Enter Address": "ป้อนที่อยู่",
          Submit: "ส่ง",
          Cancel: "ยกเลิก",
          "Choose the cryptocurrency to send:": "เลือกสกุลเงินคริปโตที่จะส่ง:",
          "Choose the cryptocurrency to receive:":
            "เลือกสกุลเงินคริปโตที่จะรับ:",
          "Address for": "ที่อยู่สำหรับ",
          Close: "ปิด",
          Wallet: "กระเป๋าสตางค์",
          Transactions: "ธุรกรรม",
          "My Cold Wallet": "LIKKIM ของฉัน",
          "Total Balance": "ยอดเงินรวม",
          Balance: "ยอดเงินคงเหลือ",
          "No cryptocurrencies available. Please add wallet first.":
            "ไม่มีสกุลเงินดิจิทัลที่พร้อมใช้งาน โปรดเพิ่มกระเป๋าเงินก่อน",
          "This chain account will be removed": "บัญชีเครือนี้จะถูกลบ",
          "Remove Chain Account": "ลบบัญชีเครือ",
          Remove: "ลบ",
          "Security in your hands": "ความปลอดภัยอยู่ในมือคุณ",
          "LIKKIM supports 27 blockchains and over 10,000 cryptocurrencies.":
            "LIKKIM รองรับ 27 บล็อกเชนและมากกว่า 10,000 สกุลเงินดิจิทัล",
          Continue: "ดำเนินการต่อ",
          "Never share the recovery phrase.": "อย่าแชร์วลีการกู้คืน",
          "Please save the recovery phrase displayed on the LIKKIM hardware wallet screen.":
            "โปรดบันทึกวลีการกู้คืนที่แสดงบนหน้าจอกระเป๋าเงินฮาร์ดแวร์ LIKKIM",
          "Scroll down to view all words": "เลื่อนลงเพื่อดูคำทั้งหมด",
          "Recovery Phrase": "วลีการกู้คืน",
          "Read the following, then save the phrase securely.":
            "อ่านข้อความต่อไปนี้ จากนั้นบันทึกวลีไว้อย่างปลอดภัย",
          "The recovery phrase alone gives you full access to your wallets and funds.":
            "วลีการกู้คืนจะทำให้คุณสามารถเข้าถึงกระเป๋าเงินและเงินทุนของคุณได้อย่างสมบูรณ์",
          "If you forget your password, you can use the recovery phrase to get back into your wallet.":
            "หากคุณลืมรหัสผ่าน คุณสามารถใช้วลีการกู้คืนเพื่อกลับเข้าสู่กระเป๋าเงินของคุณได้",
          "LIKKIM will never ask for your recovery phrase.":
            "LIKKIM จะไม่ขอวลีการกู้คืนของคุณ",
          "Never share it with anyone.": "อย่าแชร์กับใครก็ตาม",
          "You must select all 12 words before you can proceed.":
            "คุณต้องเลือกทั้ง 12 คำก่อนจึงจะดำเนินการต่อได้",
          "Verify and I've Saved the Phrase": "ตรวจสอบและฉันได้บันทึกวลีแล้ว",
          "Creating your wallet": "กำลังสร้างกระเป๋าเงินของคุณ",
          "Generating your accounts": "กำลังสร้างบัญชีของคุณ",
          "Encrypting your data": "กำลังเข้ารหัสข้อมูลของคุณ",
          "Your wallet is now ready": "กระเป๋าเงินของคุณพร้อมแล้ว",
          "Let's Go": "ไปกันเถอะ",
          "Use spaces between words": "ใช้ช่องว่างระหว่างคำ",
          "Import Recovery Phrase": "นำเข้าวลีการกู้คืน",
          Version: "เวอร์ชัน",
          "Only you can unlock your wallet":
            "มีเพียงคุณเท่านั้นที่สามารถปลดล็อกกระเป๋าเงินของคุณได้",
          "Assets can only be sent within the same chain.":
            "สินทรัพย์สามารถส่งได้เฉพาะภายในโซ่เดียวกันเท่านั้น",
          "Firmware Update": "อัปเดตเฟิร์มแวร์",
          "Sync balances to LIKKIM coldwallet":
            "ซิงค์ยอดคงเหลือกับกระเป๋าเงินเย็น LIKKIM",
          "No data available": "ไม่มีข้อมูล",
          "Search Currency": "ค้นหาสกุลเงิน",
          "Search Cryptocurrency": "ค้นหาสกุลเงินดิจิทัล",
          "Select Currency": "เลือกสกุลเงิน",
          "Enable Screen Lock": "เปิดใช้งานการล็อคหน้าจอ",
          "Enter new password": "กรอกรหัสผ่านใหม่",
          "Confirm new password": "ยืนยันรหัสผ่านใหม่",
          "Change App Screen Lock Password":
            "เปลี่ยนรหัสผ่านการล็อคหน้าจอของแอป",
          "Disable Lock Screen": "ปิดใช้งานการล็อคหน้าจอ",
          "Enter your password": "กรอกรหัสผ่านของคุณ",
          "Enter Password to Unlock": "กรอกรหัสผ่านเพื่อปลดล็อค",
        },
      },
      uk: {
        translation: {
          "Add Wallet": "Додати гаманець",
          "Create Wallet": "Створити гаманець",
          "Import Wallet": "Імпортувати гаманець",
          Close: "Закрити",
          "Value:": "Значення:",
          "Delete Card": "Видалити картку",
          "Select Language": "Вибрати мову",
          Cancel: "Скасувати",
          "Select Currency": "Вибрати валюту",
          "Set Password": "Встановити пароль",
          "Only you can unlock your wallet":
            "Тільки ви можете розблокувати свій гаманець",
          Password: "Пароль",
          "Confirm Password": "Підтвердити пароль",
          "Change Password": "Змінити пароль",
          "Default Currency": "Валюта за замовчуванням",
          "Help & Support": "Допомога та підтримка",
          "Privacy & Data": "Конфіденційність та дані",
          About: "Про",
          Language: "Мова",
          "Dark Mode": "Темний режим",
          Bluetooth: "Bluetooth",
          "Pair with Bluetooth": "З'єднати з Bluetooth",
          "LOOKING FOR DEVICES": "ПОШУК ПРИСТРОЇВ",
          "Scanning...": "Сканування...",
          "Please make sure your Cold Wallet is unlocked and Bluetooth is enabled.":
            "Будь ласка, переконайтеся, що ваш холодний гаманець розблокований і Bluetooth увімкнено.",
          Send: "Відправити",
          "Send crypto to another wallet":
            "Відправити криптовалюту на інший гаманець",
          Receive: "Отримати",
          "Receive crypto from another wallet":
            "Отримати криптовалюту з іншого гаманця",
          "Transaction History": "Історія транзакцій",
          "No Histories": "Немає історії",
          "Enter the recipient's address:": "Введіть адресу одержувача:",
          "Enter Address": "Введіть адресу",
          Submit: "Відправити",
          Cancel: "Скасувати",
          "Choose the cryptocurrency to send:":
            "Виберіть криптовалюту для відправки:",
          "Choose the cryptocurrency to receive:":
            "Виберіть криптовалюту для отримання:",
          "Address for": "Адреса для",
          Close: "Закрити",
          Wallet: "Гаманець",
          Transactions: "Транзакції",
          "My Cold Wallet": "Мій LIKKIM",
          "Total Balance": "Загальний баланс",
          Balance: "Баланс",
          "No cryptocurrencies available. Please add wallet first.":
            "Немає доступних криптовалют. Будь ласка, спочатку додайте гаманець.",
          "This chain account will be removed":
            "Цей ланцюговий акаунт буде видалено",
          "Remove Chain Account": "Видалити ланцюговий акаунт",
          Remove: "Видалити",
          "Security in your hands": "Безпека у ваших руках",
          "LIKKIM supports 27 blockchains and over 10,000 cryptocurrencies.":
            "LIKKIM підтримує 27 блокчейнів і понад 10 000 криптовалют.",
          Continue: "Продовжити",
          "Never share the recovery phrase.":
            "Ніколи не діліться фразою відновлення.",
          "Please save the recovery phrase displayed on the LIKKIM hardware wallet screen.":
            "Будь ласка, збережіть фразу відновлення, що відображається на екрані апаратного гаманця LIKKIM.",
          "Scroll down to view all words":
            "Прокрутіть вниз, щоб побачити всі слова",
          "Recovery Phrase": "Фраза відновлення",
          "Read the following, then save the phrase securely.":
            "Прочитайте наступне, а потім надійно збережіть фразу.",
          "The recovery phrase alone gives you full access to your wallets and funds.":
            "Фраза відновлення надає вам повний доступ до ваших гаманців та коштів.",
          "If you forget your password, you can use the recovery phrase to get back into your wallet.":
            "Якщо ви забудете свій пароль, ви можете скористатися фразою відновлення, щоб повернутися до свого гаманця.",
          "LIKKIM will never ask for your recovery phrase.":
            "LIKKIM ніколи не попросить вашу фразу відновлення.",
          "Never share it with anyone.": "Ніколи не діліться нею ні з ким.",
          "You must select all 12 words before you can proceed.":
            "Ви повинні вибрати всі 12 слів, перш ніж продовжити.",
          "Verify and I've Saved the Phrase": "Підтвердьте, і я зберіг фразу",
          "Creating your wallet": "Створення вашого гаманця",
          "Generating your accounts": "Створення ваших облікових записів",
          "Encrypting your data": "Шифрування ваших даних",
          "Your wallet is now ready": "Ваш гаманець готовий",
          "Let's Go": "Почнемо",
          "Only you can unlock your wallet":
            "Тільки ви можете розблокувати свій гаманець",
          "Assets can only be sent within the same chain.":
            "Активи можна надсилати лише в межах одного ланцюга.",
          "Firmware Update": "Оновлення прошивки",
          "Sync balances to LIKKIM coldwallet":
            "Синхронізація балансів із холодним гаманцем LIKKIM",
          "No data available": "Дані недоступні",
          "Search Currency": "Шукати валюту",
          "Search Cryptocurrency": "Шукати криптовалюту",
          "Select Currency": "Вибрати валюту",
          "Enable Screen Lock": "Увімкнути блокування екрана",
          "Enter new password": "Введіть новий пароль",
          "Confirm new password": "Підтвердьте новий пароль",
          "Change App Screen Lock Password":
            "Змінити пароль блокування екрана програми",
          "Disable Lock Screen": "Вимкнути блокування екрана",
          "Enter your password": "Введіть свій пароль",
          "Enter Password to Unlock": "Введіть пароль для розблокування",
        },
      },
      vi: {
        translation: {
          "Add Wallet": "Thêm Ví",
          "Create Wallet": "Tạo Ví",
          "Import Wallet": "Nhập Ví",
          Close: "Đóng",
          "Value:": "Giá trị:",
          "Delete Card": "Xóa Thẻ",
          "Select Language": "Chọn Ngôn ngữ",
          Cancel: "Hủy bỏ",
          "Select Currency": "Chọn Tiền tệ",
          "Set Password": "Đặt Mật khẩu",
          "Only you can unlock your wallet":
            "Chỉ bạn mới có thể mở khóa ví của bạn",
          Password: "Mật khẩu",
          "Confirm Password": "Xác nhận Mật khẩu",
          "Change Password": "Đổi Mật khẩu",
          "Default Currency": "Tiền tệ Mặc định",
          "Help & Support": "Trợ giúp & Hỗ trợ",
          "Privacy & Data": "Quyền riêng tư & Dữ liệu",
          About: "Về",
          Language: "Ngôn ngữ",
          "Dark Mode": "Chế độ Tối",
          Bluetooth: "Bluetooth",
          "Pair with Bluetooth": "Ghép đôi với Bluetooth",
          "LOOKING FOR DEVICES": "TÌM THIẾT BỊ",
          "Scanning...": "Quét...",
          "Please make sure your Cold Wallet is unlocked and Bluetooth is enabled.":
            "Hãy đảm bảo rằng Ví Lạnh của bạn đã được mở khóa và Bluetooth được kích hoạt.",
          Send: "Gửi",
          "Send crypto to another wallet": "Gửi tiền điện tử đến ví khác",
          Receive: "Nhận",
          "Receive crypto from another wallet": "Nhận tiền điện tử từ ví khác",
          "Transaction History": "Lịch sử giao dịch",
          "No Histories": "Không có lịch sử",
          "Enter the recipient's address:": "Nhập địa chỉ người nhận:",
          "Enter Address": "Nhập địa chỉ",
          Submit: "Gửi đi",
          Cancel: "Hủy bỏ",
          "Choose the cryptocurrency to send:":
            "Chọn loại tiền điện tử để gửi:",
          "Choose the cryptocurrency to receive:":
            "Chọn loại tiền điện tử để nhận:",
          "Address for": "Địa chỉ cho",
          Close: "Đóng",
          Wallet: "Ví",
          Transactions: "Giao dịch",
          "My Cold Wallet": "LIKKIM của tôi",
          "Total Balance": "Tổng Số Dư",
          Balance: "Số dư",
          "No cryptocurrencies available. Please add wallet first.":
            "Không có tiền điện tử nào khả dụng. Vui lòng thêm ví trước.",
          "This chain account will be removed": "Tài khoản chuỗi này sẽ bị xóa",
          "Remove Chain Account": "Xóa tài khoản chuỗi",
          Remove: "Xóa",
          "Security in your hands": "Bảo mật trong tay bạn",
          "LIKKIM supports 27 blockchains and over 10,000 cryptocurrencies.":
            "LIKKIM hỗ trợ 27 blockchain và hơn 10.000 loại tiền điện tử.",
          Continue: "Tiếp tục",
          "Never share the recovery phrase.":
            "Không bao giờ chia sẻ cụm từ khôi phục.",
          "Please save the recovery phrase displayed on the LIKKIM hardware wallet screen.":
            "Vui lòng lưu cụm từ khôi phục hiển thị trên màn hình ví phần cứng LIKKIM.",
          "Scroll down to view all words": "Cuộn xuống để xem tất cả các từ",
          "Recovery Phrase": "Cụm từ khôi phục",
          "Read the following, then save the phrase securely.":
            "Đọc phần sau, sau đó lưu cụm từ một cách an toàn.",
          "The recovery phrase alone gives you full access to your wallets and funds.":
            "Cụm từ khôi phục duy nhất cho phép bạn truy cập đầy đủ vào ví và tiền của mình.",
          "If you forget your password, you can use the recovery phrase to get back into your wallet.":
            "Nếu bạn quên mật khẩu, bạn có thể sử dụng cụm từ khôi phục để quay lại ví của mình.",
          "LIKKIM will never ask for your recovery phrase.":
            "LIKKIM sẽ không bao giờ yêu cầu cụm từ khôi phục của bạn.",
          "Never share it with anyone.":
            "Đừng bao giờ chia sẻ nó với bất kỳ ai.",
          "You must select all 12 words before you can proceed.":
            "Bạn phải chọn đủ 12 từ trước khi tiếp tục.",
          "Verify and I've Saved the Phrase": "Xác nhận và tôi đã lưu cụm từ",
          "Creating your wallet": "Đang tạo ví của bạn",
          "Generating your accounts": "Đang tạo tài khoản của bạn",
          "Encrypting your data": "Đang mã hóa dữ liệu của bạn",
          "Your wallet is now ready": "Ví của bạn đã sẵn sàng",
          "Let's Go": "Bắt đầu",
          "Use spaces between words": "Sử dụng khoảng trắng giữa các từ",
          "Import Recovery Phrase": "Nhập cụm từ khôi phục",
          Version: "Phiên bản",
          "Only you can unlock your wallet":
            "Chỉ bạn mới có thể mở khóa ví của mình",
          "Assets can only be sent within the same chain.":
            "Tài sản chỉ có thể được gửi trong cùng một chuỗi.",
          "Firmware Update": "Cập nhật firmware",
          "Sync balances to LIKKIM coldwallet":
            "Đồng bộ số dư với ví lạnh LIKKIM",
          "No data available": "Không có dữ liệu",
          "Search Currency": "Tìm kiếm tiền tệ",
          "Search Cryptocurrency": "Tìm kiếm tiền điện tử",
          "Select Currency": "Chọn tiền tệ",
          "Enable Screen Lock": "Bật khóa màn hình",
          "Enter new password": "Nhập mật khẩu mới",
          "Confirm new password": "Xác nhận mật khẩu mới",
          "Change App Screen Lock Password":
            "Đổi mật khẩu khóa màn hình ứng dụng",
          "Disable Lock Screen": "Tắt khóa màn hình",
          "Enter your password": "Nhập mật khẩu của bạn",
          "Enter Password to Unlock": "Nhập mật khẩu để mở khóa",
        },
      },
      id: {
        translation: {
          "Add Wallet": "Tambah Dompet",
          "Create Wallet": "Buat Dompet",
          "Import Wallet": "Impor Dompet",
          Close: "Tutup",
          "Value:": "Nilai:",
          "Delete Card": "Hapus Kartu",
          "Select Language": "Pilih Bahasa",
          Cancel: "Batalkan",
          "Select Currency": "Pilih Mata Uang",
          "Set Password": "Setel Kata Sandi",
          "Only you can unlock your wallet":
            "Hanya Anda yang bisa membuka kunci dompet Anda",
          Password: "Kata Sandi",
          "Confirm Password": "Konfirmasi Kata Sandi",
          "Change Password": "Ganti Kata Sandi",
          "Default Currency": "Mata Uang Default",
          "Help & Support": "Bantuan & Dukungan",
          "Privacy & Data": "Privasi & Data",
          About: "Tentang",
          Language: "Bahasa",
          "Dark Mode": "Mode Gelap",
          Bluetooth: "Bluetooth",
          "Pair with Bluetooth": "Pasangkan dengan Bluetooth",
          "LOOKING FOR DEVICES": "MENCARI PERANGKAT",
          "Scanning...": "Memindai...",
          "Please make sure your Cold Wallet is unlocked and Bluetooth is enabled.":
            "Pastikan Dompet Dingin Anda tidak terkunci dan Bluetooth diaktifkan.",
          Send: "Kirim",
          "Send crypto to another wallet": "Kirim kripto ke dompet lain",
          Receive: "Terima",
          "Receive crypto from another wallet":
            "Terima kripto dari dompet lain",
          "Transaction History": "Riwayat Transaksi",
          "No Histories": "Tidak ada riwayat",
          "Enter the recipient's address:": "Masukkan alamat penerima:",
          "Enter Address": "Masukkan alamat",
          Submit: "Kirim",
          Cancel: "Batalkan",
          "Choose the cryptocurrency to send:":
            "Pilih cryptocurrency untuk dikirim:",
          "Choose the cryptocurrency to receive:":
            "Pilih cryptocurrency untuk diterima:",
          "Address for": "Alamat untuk",
          Close: "Tutup",
          Wallet: "Dompet",
          Transactions: "Transaksi",
          "My Cold Wallet": "LIKKIM Saya",
          "Total Balance": "Saldo Total",
          Balance: "Saldo",
          "No cryptocurrencies available. Please add wallet first.":
            "Tidak ada cryptocurrency yang tersedia. Harap tambahkan dompet terlebih dahulu.",
          "This chain account will be removed": "Akun rantai ini akan dihapus",
          "Remove Chain Account": "Hapus akun rantai",
          Remove: "Hapus",
          "Security in your hands": "Keamanan di tangan Anda",
          "LIKKIM supports 27 blockchains and over 10,000 cryptocurrencies.":
            "LIKKIM mendukung 27 blockchain dan lebih dari 10.000 cryptocurrency.",
          Continue: "Lanjutkan",
          "Never share the recovery phrase.":
            "Jangan pernah membagikan frasa pemulihan.",
          "Please save the recovery phrase displayed on the LIKKIM hardware wallet screen.":
            "Silakan simpan frasa pemulihan yang ditampilkan di layar dompet perangkat keras LIKKIM.",
          "Scroll down to view all words":
            "Gulir ke bawah untuk melihat semua kata",
          "Recovery Phrase": "Frasa pemulihan",
          "Read the following, then save the phrase securely.":
            "Baca yang berikut, lalu simpan frasa dengan aman.",
          "The recovery phrase alone gives you full access to your wallets and funds.":
            "Frasa pemulihan saja memberi Anda akses penuh ke dompet dan dana Anda.",
          "If you forget your password, you can use the recovery phrase to get back into your wallet.":
            "Jika Anda lupa kata sandi, Anda dapat menggunakan frasa pemulihan untuk kembali ke dompet Anda.",
          "LIKKIM will never ask for your recovery phrase.":
            "LIKKIM tidak akan pernah meminta frasa pemulihan Anda.",
          "Never share it with anyone.":
            "Jangan pernah membagikannya dengan siapa pun.",
          "You must select all 12 words before you can proceed.":
            "Anda harus memilih semua 12 kata sebelum Anda dapat melanjutkan.",
          "Verify and I've Saved the Phrase":
            "Verifikasi dan saya telah menyimpan frasa",
          "Creating your wallet": "Membuat dompet Anda",
          "Generating your accounts": "Membuat akun Anda",
          "Encrypting your data": "Mengenkripsi data Anda",
          "Your wallet is now ready": "Dompet Anda sekarang siap",
          "Let's Go": "Ayo pergi",
          "Use spaces between words": "Gunakan spasi di antara kata-kata",
          "Import Recovery Phrase": "Impor Frasa Pemulihan",
          Version: "Versi",
          "Only you can unlock your wallet":
            "Hanya Anda yang bisa membuka dompet Anda",
          "Assets can only be sent within the same chain.":
            "Aset hanya dapat dikirim dalam rantai yang sama.",
          "Firmware Update": "Pembaruan firmware",
          "Sync balances to LIKKIM coldwallet":
            "Sinkronkan saldo ke dompet dingin LIKKIM",
          "No data available": "Tidak ada data",
          "Search Currency": "Cari mata uang",
          "Search Cryptocurrency": "Cari mata uang kripto",
          "Select Currency": "Pilih mata uang",
          "Enable Screen Lock": "Aktifkan kunci layar",
          "Enter new password": "Masukkan kata sandi baru",
          "Confirm new password": "Konfirmasi kata sandi baru",
          "Change App Screen Lock Password":
            "Ubah kata sandi kunci layar aplikasi",
          "Disable Lock Screen": "Nonaktifkan kunci layar",
          "Enter your password": "Masukkan kata sandi Anda",
          "Enter Password to Unlock": "Masukkan kata sandi untuk membuka kunci",
        },
      },
      tl: {
        translation: {
          "Add Wallet": "Magdagdag ng Wallet",
          "Create Wallet": "Lumikha ng Wallet",
          "Import Wallet": "Mag-import ng Wallet",
          Close: "Isara",
          "Value:": "Halaga:",
          "Delete Card": "Tanggalin ang Card",
          "Select Language": "Piliin ang Wika",
          Cancel: "Kanselahin",
          "Select Currency": "Piliin ang Pera",
          "Set Password": "Itakda ang Password",
          "Only you can unlock your wallet":
            "Ikaw lang ang makakapagbukas ng iyong wallet",
          Password: "Password",
          "Confirm Password": "Kumpirmahin ang Password",
          "Change Password": "Palitan ang Password",
          "Default Currency": "Default na Pera",
          "Help & Support": "Tulong at Suporta",
          "Privacy & Data": "Privacy at Data",
          About: "Tungkol sa",
          Language: "Wika",
          "Dark Mode": "Madilim na Mode",
          Bluetooth: "Bluetooth",
          "Pair with Bluetooth": "Ipares sa Bluetooth",
          "LOOKING FOR DEVICES": "HINAHANAP ANG MGA DEVICE",
          "Scanning...": "Pag-scan...",
          "Please make sure your Cold Wallet is unlocked and Bluetooth is enabled.":
            "Mangyaring tiyakin na ang iyong Cold Wallet ay naka-unlock at naka-enable ang Bluetooth.",
          Send: "Magpadala",
          "Send crypto to another wallet":
            "Magpadala ng crypto sa ibang wallet",
          Receive: "Tumanggap",
          "Receive crypto from another wallet":
            "Tumanggap ng crypto mula sa ibang wallet",
          "Transaction History": "Kasaysayan ng Transaksyon",
          "No Histories": "Walang Kasaysayan",
          "Enter the recipient's address:": "Ilagay ang address ng tatanggap:",
          "Enter Address": "Ilagay ang Address",
          Submit: "Ipasa",
          Cancel: "Kanselahin",
          "Choose the cryptocurrency to send:":
            "Piliin ang cryptocurrency na ipapadala:",
          "Choose the cryptocurrency to receive:":
            "Piliin ang cryptocurrency na tatanggapin:",
          "Address for": "Address para sa",
          Close: "Isara",
          Wallet: "Pitaka",
          Transactions: "Mga transaksyon",
          "My Cold Wallet": "Aking LIKKIM",
          "Total Balance": "Kabuuang Balanse",
          Balance: "Balanse",
          "No cryptocurrencies available. Please add wallet first.":
            "Walang magagamit na mga cryptocurrency. Mangyaring magdagdag muna ng pitaka.",
          "This chain account will be removed":
            "Ang chain account na ito ay aalisin",
          "Remove Chain Account": "Alisin ang chain account",
          Remove: "Alisin",
          "Security in your hands": "Seguridad sa iyong mga kamay",
          "LIKKIM supports 27 blockchains and over 10,000 cryptocurrencies.":
            "Sinusuportahan ng LIKKIM ang 27 blockchains at higit sa 10,000 cryptocurrencies.",
          Continue: "Magpatuloy",
          "Never share the recovery phrase.":
            "Huwag kailanman ibahagi ang parirala ng pagbawi.",
          "Please save the recovery phrase displayed on the LIKKIM hardware wallet screen.":
            "Paki-save ang parirala ng pagbawi na ipinapakita sa screen ng LIKKIM hardware wallet.",
          "Scroll down to view all words":
            "Mag-scroll pababa upang makita ang lahat ng mga salita",
          "Recovery Phrase": "Parirala ng pagbawi",
          "Read the following, then save the phrase securely.":
            "Basahin ang sumusunod, pagkatapos ay i-save ang parirala nang ligtas.",
          "The recovery phrase alone gives you full access to your wallets and funds.":
            "Ang parirala ng pagbawi lamang ay nagbibigay sa iyo ng buong access sa iyong mga wallet at pondo.",
          "If you forget your password, you can use the recovery phrase to get back into your wallet.":
            "Kung nakalimutan mo ang iyong password, maaari mong gamitin ang parirala ng pagbawi upang makabalik sa iyong wallet.",
          "LIKKIM will never ask for your recovery phrase.":
            "Hindi hihilingin ng LIKKIM ang iyong parirala ng pagbawi.",
          "Never share it with anyone.":
            "Huwag kailanman ibahagi ito sa sinuman.",
          "You must select all 12 words before you can proceed.":
            "Dapat mong piliin ang lahat ng 12 salita bago ka magpatuloy.",
          "Verify and I've Saved the Phrase":
            "I-verify at nai-save ko ang parirala",
          "Creating your wallet": "Gumagawa ng iyong wallet",
          "Generating your accounts": "Gumagawa ng iyong mga account",
          "Encrypting your data": "Ini-encrypt ang iyong data",
          "Your wallet is now ready": "Handa na ang iyong wallet",
          "Let's Go": "Tara na",
          "Use spaces between words":
            "Gumamit ng mga espasyo sa pagitan ng mga salita",
          "Import Recovery Phrase": "I-import ang Parirala ng Pagbawi",
          Version: "Bersyon",
          "Only you can unlock your wallet":
            "Ikaw lang ang makakapagbukas ng iyong pitaka",
          "Assets can only be sent within the same chain.":
            "Ang mga ari-arian ay maaari lamang ipadala sa loob ng parehong kadena.",
          "Firmware Update": "Pag-update ng firmware",
          "Sync balances to LIKKIM coldwallet":
            "I-sync ang mga balanse sa LIKKIM coldwallet",
          "No data available": "Walang magagamit na data",
          "Search Currency": "Maghanap ng Pera",
          "Search Cryptocurrency": "Maghanap ng Cryptocurrency",
          "Select Currency": "Piliin ang Pera",
          "Enable Screen Lock": "I-enable ang Screen Lock",
          "Enter new password": "Ilagay ang bagong password",
          "Confirm new password": "Kumpirmahin ang bagong password",
          "Change App Screen Lock Password":
            "Palitan ang Password ng Screen Lock ng App",
          "Disable Lock Screen": "I-disable ang Screen Lock",
          "Enter your password": "Ilagay ang iyong password",
          "Enter Password to Unlock": "Ilagay ang Password upang I-unlock",
        },
      },
      bn: {
        translation: {
          "Add Wallet": "ওয়ালেট যোগ করুন",
          "Create Wallet": "ওয়ালেট তৈরি করুন",
          "Import Wallet": "ওয়ালেট আমদানি করুন",
          Close: "বন্ধ করুন",
          "Value:": "মান:",
          "Delete Card": "কার্ড মুছুন",
          "Select Language": "ভাষা নির্বাচন করুন",
          Cancel: "বাতিল করুন",
          "Select Currency": "মুদ্রা নির্বাচন করুন",
          "Set Password": "পাসওয়ার্ড সেট করুন",
          "Only you can unlock your wallet":
            "শুধুমাত্র আপনি আপনার ওয়ালেট আনলক করতে পারেন",
          Password: "পাসওয়ার্ড",
          "Confirm Password": "পাসওয়ার্ড নিশ্চিত করুন",
          "Change Password": "পাসওয়ার্ড পরিবর্তন করুন",
          "Default Currency": "ডিফল্ট মুদ্রা",
          "Help & Support": "সহায়তা এবং সহায়তা",
          "Privacy & Data": "গোপনীয়তা এবং ডেটা",
          About: "সম্পর্কিত",
          Language: "ভাষা",
          "Dark Mode": "ডার্ক মোড",
          Bluetooth: "ব্লুটুথ",
          "Pair with Bluetooth": "ব্লুটুথের সাথে জোড়া",
          "LOOKING FOR DEVICES": "ডিভাইসের জন্য সন্ধান করা হচ্ছে",
          "Scanning...": "স্ক্যান করা হচ্ছে...",
          "Please make sure your Cold Wallet is unlocked and Bluetooth is enabled.":
            "অনুগ্রহ করে নিশ্চিত করুন যে আপনার ঠান্ডা ওয়ালেট আনলক করা হয়েছে এবং ব্লুটুথ সক্রিয় করা হয়েছে।",
          Send: "পাঠান",
          "Send crypto to another wallet": "অন্য ওয়ালেটে ক্রিপ্টো পাঠান",
          Receive: "গ্রহণ করুন",
          "Receive crypto from another wallet":
            "অন্য ওয়ালেট থেকে ক্রিপ্টো গ্রহণ করুন",
          "Transaction History": "লেনদেনের ইতিহাস",
          "No Histories": "কোনো ইতিহাস নেই",
          "Enter the recipient's address:": "প্রাপকের ঠিকানা লিখুন:",
          "Enter Address": "ঠিকানা লিখুন",
          Submit: "জমা দিন",
          Cancel: "বাতিল করুন",
          "Choose the cryptocurrency to send:":
            "পাঠানোর জন্য ক্রিপ্টোকারেন্সি নির্বাচন করুন:",
          "Choose the cryptocurrency to receive:":
            "গ্রহণের জন্য ক্রিপ্টোকারেন্সি নির্বাচন করুন:",
          "Address for": "এর জন্য ঠিকানা",
          Close: "বন্ধ করুন",
          Wallet: "ওয়ালেট",
          Transactions: "লেনদেন",
          "My Cold Wallet": "আমার LIKKIM",
          "Total Balance": "মোট ব্যালেন্স",
          Balance: "ব্যালেন্স",
          "No cryptocurrencies available. Please add wallet first.":
            "কোনও ক্রিপ্টোকারেন্সি উপলব্ধ নেই। প্রথমে একটি ওয়ালেট যোগ করুন।",
          "This chain account will be removed":
            "এই চেইন অ্যাকাউন্টটি সরানো হবে",
          "Remove Chain Account": "চেইন অ্যাকাউন্ট সরান",
          Remove: "সরান",
          "Security in your hands": "নিরাপত্তা আপনার হাতে",
          "LIKKIM supports 27 blockchains and over 10,000 cryptocurrencies.":
            "LIKKIM 27 টি ব্লকচেইন এবং 10,000 টিরও বেশি ক্রিপ্টোকারেন্সি সমর্থন করে।",
          Continue: "চালিয়ে যান",
          "Never share the recovery phrase.":
            "পুনরুদ্ধার বাক্যাংশটি কখনই শেয়ার করবেন না।",
          "Please save the recovery phrase displayed on the LIKKIM hardware wallet screen.":
            "দয়া করে LIKKIM হার্ডওয়্যার ওয়ালেট স্ক্রিনে প্রদর্শিত পুনরুদ্ধার বাক্যাংশটি সংরক্ষণ করুন।",
          "Scroll down to view all words": "সমস্ত শব্দ দেখতে নীচে স্ক্রোল করুন",
          "Recovery Phrase": "পুনরুদ্ধার বাক্যাংশ",
          "Read the following, then save the phrase securely.":
            "নীচেরটি পড়ুন, তারপরে বাক্যাংশটি নিরাপদে সংরক্ষণ করুন।",
          "The recovery phrase alone gives you full access to your wallets and funds.":
            "পুনরুদ্ধার বাক্যাংশ আপনাকে আপনার ওয়ালেট এবং তহবিলে সম্পূর্ণ অ্যাক্সেস দেয়।",
          "If you forget your password, you can use the recovery phrase to get back into your wallet.":
            "আপনি যদি আপনার পাসওয়ার্ড ভুলে যান, আপনি আপনার ওয়ালেটে ফিরে যেতে পুনরুদ্ধার বাক্যাংশ ব্যবহার করতে পারেন।",
          "LIKKIM will never ask for your recovery phrase.":
            "LIKKIM কখনই আপনার পুনরুদ্ধার বাক্যাংশ চাইবে না।",
          "Never share it with anyone.": "এটি কখনই কারও সাথে ভাগ করবেন না।",
          "You must select all 12 words before you can proceed.":
            "আপনাকে অব্যাহত রাখার আগে সমস্ত 12টি শব্দ নির্বাচন করতে হবে।",
          "Verify and I've Saved the Phrase":
            "যাচাই করুন এবং আমি বাক্যাংশটি সংরক্ষণ করেছি",
          "Creating your wallet": "আপনার ওয়ালেট তৈরি করা হচ্ছে",
          "Generating your accounts": "আপনার অ্যাকাউন্ট তৈরি করা হচ্ছে",
          "Encrypting your data": "আপনার ডেটা এনক্রিপ্ট করা হচ্ছে",
          "Your wallet is now ready": "আপনার ওয়ালেট এখন প্রস্তুত",
          "Let's Go": "চলুন",
          "Use spaces between words": "শব্দের মধ্যে স্পেস ব্যবহার করুন",
          "Import Recovery Phrase": "পুনরুদ্ধার বাক্যাংশ আমদানি করুন",
          Version: "সংস্করণ",
          "Only you can unlock your wallet":
            "শুধু আপনিই আপনার ওয়ালেট আনলক করতে পারবেন",
          "Assets can only be sent within the same chain.":
            "সম্পদগুলি কেবল একই শৃঙ্খলে পাঠানো যেতে পারে।",
          "Firmware Update": "ফার্মওয়্যার আপডেট",
          "Sync balances to LIKKIM coldwallet":
            "LIKKIM ঠান্ডা ওয়ালেটে ব্যালেন্স সিঙ্ক করুন",
          "No data available": "কোনো তথ্য উপলব্ধ নেই",
          "Search Currency": "মুদ্রা খুঁজুন",
          "Search Cryptocurrency": "ক্রিপ্টোকারেন্সি খুঁজুন",
          "Select Currency": "মুদ্রা নির্বাচন করুন",
          "Enable Screen Lock": "স্ক্রিন লক সক্রিয় করুন",
          "Enter new password": "নতুন পাসওয়ার্ড লিখুন",
          "Confirm new password": "নতুন পাসওয়ার্ড নিশ্চিত করুন",
          "Change App Screen Lock Password":
            "অ্যাপ স্ক্রিন লক পাসওয়ার্ড পরিবর্তন করুন",
          "Disable Lock Screen": "লক স্ক্রিন অক্ষম করুন",
          "Enter your password": "আপনার পাসওয়ার্ড লিখুন",
          "Enter Password to Unlock": "আনলক করতে পাসওয়ার্ড লিখুন",
        },
      },
    },
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
