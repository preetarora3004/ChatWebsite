import 'dotenv/config'

export const env = {
   socket_dev : process.env.SOCKET_URL_DEV,
   socket_prod : process.env.SOCKET_URL_PROD
}
