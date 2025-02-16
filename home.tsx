import { createORPCClient } from '@orpc/client'
import { RPCLink } from '@orpc/client/fetch'
import {createRoot} from 'react-dom/client'
import type { router } from '.'
import { useEffect } from 'react'

const rpcLink = new RPCLink({
    url: 'http://localhost:3000/rpc',
})

const rpc = createORPCClient<typeof router>(rpcLink)

function Home() {
    useEffect(() => {
        const controller = new AbortController()

        ;(async () => {
            const stream = await rpc.onChange(undefined, { signal: controller.signal })
            for await (const event of stream) {
                console.log(event)
            }
        })()

        return () => {
            controller.abort()
        }
    }, [])

    return (
        <div>
            <h1>BunHono Playground</h1>
            <p>Hello, world!</p>
        </div>
    )
}

const root = createRoot(document.getElementById('root')!)
root.render(<Home />)