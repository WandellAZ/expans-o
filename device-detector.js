// Funções avançadas de detecção de dispositivo via internet

class DeviceDetector {
  constructor() {
    this.userAgent = navigator.userAgent;
    this.screenWidth = window.screen.width;
    this.screenHeight = window.screen.height;
  }

  // Detectar dispositivo via múltiplas APIs
  async detectDevice() {
    try {
      // Tentar múltiplas APIs
      const results = await Promise.allSettled([
        this.detectViaUserAgentAPI(),
        this.detectViaDeviceAPI(),
        this.detectViaIPAPI()
      ]);

      console.log("API Results:", results);

      // Combinar resultados
      const deviceInfo = this.combineResults(results);
      return deviceInfo;

    } catch (error) {
      console.log("Erro nas APIs, usando detecção local:", error);
      return this.detectLocal();
    }
  }

  // API 1: User-Agent Parser
  async detectViaUserAgentAPI() {
    try {
      const response = await fetch(`https://api.useragentapi.com/parse?ua=${encodeURIComponent(this.userAgent)}`);
      const data = await response.json();
      return { source: 'useragent', data };
    } catch (error) {
      return { source: 'useragent', error: error.message };
    }
  }

  // API 2: Device Detector
  async detectViaDeviceAPI() {
    try {
      const response = await fetch(`https://api.devicedetector.com/v1/detect?user_agent=${encodeURIComponent(this.userAgent)}`);
      const data = await response.json();
      return { source: 'device', data };
    } catch (error) {
      return { source: 'device', error: error.message };
    }
  }

  // API 3: IP-based detection
  async detectViaIPAPI() {
    try {
      const response = await fetch('https://api.ipapi.com/api/check?access_key=free');
      const data = await response.json();
      return { source: 'ip', data };
    } catch (error) {
      return { source: 'ip', error: error.message };
    }
  }

  // Combinar resultados das APIs
  combineResults(results) {
    let deviceName = '';
    let modelName = '';
    let brandName = '';

    results.forEach(result => {
      if (result.status === 'fulfilled' && result.value.data) {
        const data = result.value.data;
        
        if (data.device) {
          deviceName = data.device.model || deviceName;
          brandName = data.device.brand || brandName;
        }
        
        if (data.model) {
          modelName = data.model || modelName;
        }
        
        if (data.brand) {
          brandName = data.brand || brandName;
        }
      }
    });

    console.log("Combined Device Info:", { deviceName, modelName, brandName });

    // Detectar dispositivo específico
    return this.detectSpecificDevice(deviceName, modelName, brandName);
  }

  // Detectar dispositivo específico
  detectSpecificDevice(deviceName, modelName, brandName) {
    const device = (deviceName + ' ' + modelName + ' ' + brandName).toLowerCase();

    // Poco M5 Pro
    if (device.includes('poco') || device.includes('xiaomi') || device.includes('m5')) {
      return {
        title: "Poco M5 Pro Detectado via Internet!",
        emoji: "🐱",
        name: "Wandell",
        class: "poco-m5-pro"
      };
    }

    // Samsung A55
    if (device.includes('samsung') && device.includes('a55')) {
      return {
        title: "Samsung A55 Detectado via Internet!",
        emoji: "🐱",
        name: "Ana",
        class: "a55"
      };
    }

    // Samsung A54
    if (device.includes('samsung') && device.includes('a54')) {
      return {
        title: "Samsung A54 Detectado via Internet!",
        emoji: "🐱",
        name: "Robson",
        class: "a54"
      };
    }

    // Samsung A34
    if (device.includes('samsung') && device.includes('a34')) {
      return {
        title: "Samsung A34 Detectado via Internet!",
        emoji: "🐱",
        name: "Jeff",
        class: "a34"
      };
    }

    // Fallback para detecção local
    return this.detectLocal();
  }

  // Detecção local como fallback
  detectLocal() {
    const userAgent = this.userAgent.toLowerCase();
    const width = this.screenWidth;
    const height = this.screenHeight;

    // Poco M5 Pro
    if (userAgent.includes("poco") || userAgent.includes("m5") || userAgent.includes("redmi") || userAgent.includes("xiaomi")) {
      return {
        title: "Poco M5 Pro Detectado!",
        emoji: "🐱",
        name: "Wandell",
        class: "poco-m5-pro"
      };
    }

    // Samsung A55
    if (userAgent.includes("sm-a555") || userAgent.includes("a55") || userAgent.includes("samsung") && userAgent.includes("a55")) {
      return {
        title: "Samsung A55 Detectado!",
        emoji: "🐱",
        name: "Ana",
        class: "a55"
      };
    }

    // Samsung A54
    if (userAgent.includes("sm-a545") || userAgent.includes("a54") || userAgent.includes("samsung") && userAgent.includes("a54")) {
      return {
        title: "Samsung A54 Detectado!",
        emoji: "🐱",
        name: "Robson",
        class: "a54"
      };
    }

    // Samsung A34
    if (userAgent.includes("sm-a345") || userAgent.includes("a34") || userAgent.includes("samsung") && userAgent.includes("a34")) {
      return {
        title: "Samsung A34 Detectado!",
        emoji: "🐱",
        name: "Jeff",
        class: "a34"
      };
    }

    // Detecção por resolução
    if (width === 1080 && height === 2400) {
      return {
        title: "Dispositivo com resolução 1080x2400",
        emoji: "🐱",
        name: "Dispositivo Detectado",
        class: "a55"
      };
    }

    if (width === 1080 && height === 2340) {
      return {
        title: "Dispositivo com resolução 1080x2340",
        emoji: "🐱",
        name: "Dispositivo Detectado",
        class: "a54"
      };
    }

    // Fallback genérico
    return {
      title: "Dispositivo Android Detectado",
      emoji: "🐱",
      name: "Android User",
      class: "a55"
    };
  }
}

// Exportar para uso global
window.DeviceDetector = DeviceDetector; 