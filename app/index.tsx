import { Text, TouchableOpacity, View } from 'react-native'
import { useEffect } from 'react'
import { useRouter } from 'expo-router'
import * as SecureStore from 'expo-secure-store'

import { makeRedirectUri, useAuthRequest } from 'expo-auth-session'

import NlwLogo from '../src/assets/nlw-spacetime-logo.svg'
import { api } from '../src/lib/api'

const discovery = {
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  tokenEndpoint: 'https://github.com/login/oauth/access_token',
  revocationEndpoint:
    'https://github.com/settings/connections/applications/1d2a0ccab2bed4c8b928'
}

export default function App() {
  const router = useRouter()

  const [request, response, signInWithGithub] = useAuthRequest(
    {
      clientId: '1d2a0ccab2bed4c8b928',
      scopes: ['identify'],
      redirectUri: makeRedirectUri({
        scheme: 'nlwspacetime'
      })
    },
    discovery
  )

  async function handleGithubOAuth(code: string) {
    const response = await api.post('/register', {
      code
    })

    const { token } = response.data

    await SecureStore.setItemAsync('token', token)

    router.push('/memories')
  }

  useEffect(() => {
    // console.log(makeRedirectUri({
    //   scheme: 'nlwspacetime'
    // }))
    if (response?.type === 'success') {
      const { code } = response.params

      handleGithubOAuth(code)
    }
  }, [response])

  return (
    <View className="px-8 py-10 flex-1 items-center">
      <View className="flex-1 items-center justify-center gap-6">
        <NlwLogo />

        <View className="space-y-2">
          <Text className="text-center font-title text-2xl leading-tight text-gray-50">
            Sua cápsula do tempo
          </Text>
          <Text className="text-center font-body text-base leading-relaxed text-gray-100">
            Colecione momentos marcantes da sua jornada e compartilhe (se
            quiser) com o mundo!
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          className="rounded-full bg-green-500 px-5 py-3"
          onPress={() => signInWithGithub()}
        >
          <Text className="font-alt text-sm uppercase text-black">
            COMEÇAR A CADASTRAR
          </Text>
        </TouchableOpacity>
      </View>

      <Text className="text-center font-body text-sm leading-relaxed text-gray-200">
        Feito com 💜 no NLW da Rocketseat
      </Text>
    </View>
  )
}
