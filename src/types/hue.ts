export interface HueBridge {
    ip: string
    username: string
    clientkey: string
  }
  
  export interface Light {
    id: string
    metadata: {
      name: string
    }
    services: Array<{
      rid: string
      rtype: string
    }>
  }
  
  