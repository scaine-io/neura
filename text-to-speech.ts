import { Client } from '@gradio/client'
import axios from 'axios'
import fs from 'fs'

async function downloadWithAxios() {
	try {
		const client = await Client.connect('https://kokoro1759063790041-0hba4192fw3wr926n8tcw3ih4b72.tec-s31.onthetaedgecloud.com/')

		const result = await client.predict('/generate_first', {
			text: 'Hello my name is Peter',
			voice: 'af_heart',
			speed: 1,
		}) as { data: Array<{ url?: string } | string> }

		console.log('Result:', result)

		if (result && result.data && result.data[0]) {
			const audioUrl = typeof result.data[0] === 'string'
				? result.data[0]
				: result.data[0].url

			if (audioUrl) {
				const response = await axios({
					method: 'GET',
					url: audioUrl,
					responseType: 'stream',
				})

				const writer = fs.createWriteStream('./output.wav')
				response.data.pipe(writer)

				await new Promise((resolve, reject) => {
					writer.on('finish', () => resolve(undefined))
					writer.on('error', reject)
				})

				console.log('✅ Audio downloaded successfully to output.wav')
			}
		}
	} catch (err: any) {
		console.error('Error:', err.message)
	}
}

downloadWithAxios()
