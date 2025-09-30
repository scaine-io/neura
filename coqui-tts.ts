import { Client } from '@gradio/client'
import axios from 'axios'
import fs from 'fs'

export class CoquiTTSClient {
	private client: Client | null = null
	private endpoint: string

	constructor(endpoint = 'http://localhost:7860') {
		this.endpoint = endpoint
	}

	async connect() {
		try {
			console.log(`🔗 Connecting to ${this.endpoint}...`)
			this.client = await Client.connect(this.endpoint)
			console.log('✅ Connected to Coqui TTS')
			return true
		} catch (error) {
			console.error('❌ Connection failed:', error)
			return false
		}
	}

	async generateSpeech(text: string): Promise<string | null> {
		if (!this.client) {
			const connected = await this.connect()
			if (!connected) return null
		}

		try {
			console.log(`🎤 Generating speech for: "${text}"`)

			const result = await this.client!.predict(1, [text])

			const resultData = result as { data: any[] }
			if (resultData && resultData.data && resultData.data[0]) {
				const audioData = resultData.data[0] as any

				if (audioData && audioData.name && audioData.is_file) {
					// Use the correct Gradio file URL pattern: /file={full_path}
					const audioUrl = `${this.endpoint}/file=${audioData.name}`
					console.log('🔗 Audio URL:', audioUrl)

					const response = await axios({
						method: 'GET',
						url: audioUrl,
						responseType: 'stream',
						timeout: 30000,
					})

					const outputPath = `./coqui_${Date.now()}.wav`
					const writer = fs.createWriteStream(outputPath)
					response.data.pipe(writer)

					await new Promise<void>((resolve, reject) => {
						writer.on('finish', resolve)
						writer.on('error', reject)
					})

					console.log(`✅ Audio saved to: ${outputPath}`)
					return outputPath
				}
			}

			console.error('❌ No valid audio data in response')
			return null
		} catch (error) {
			console.error('❌ Generation failed:', error)
			return null
		}
	}
}

// Main execution - single test only
async function main() {
	// Check if Coqui TTS is running
	try {
		await axios.get('http://localhost:7860', { timeout: 5000 })
		console.log('✅ Coqui TTS is running')
	} catch (error) {
		console.log('❌ Coqui TTS is not running')
		return
	}

	// Single test
	const tts = new CoquiTTSClient()
	const audioFile = await tts.generateSpeech('Hello world! This is a simple test.')

	if (audioFile) {
		console.log(`🎉 Success! Generated: ${audioFile}`)
	} else {
		console.log('❌ Failed to generate speech')
	}
}

// Execute
if (require.main === module) {
	main().catch(console.error)
}
