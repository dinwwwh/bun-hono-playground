import { Hono } from 'hono'
import { eventIterator, os, withEventMeta } from '@orpc/server'
import * as v from 'valibot'
import { createMiddleware, RPCHandler } from '@orpc/server/hono'
import Home from './home.html'

export const router = {
    onChange: os
        .output(eventIterator(v.object({ message: v.string() })))
        .handler(async function* ({ context }) {
            while (true) {
                console.log("here???")
                yield withEventMeta({ message: "Hello, world!" }, { id: "some-id", retry: 1000 })
                await new Promise((resolve) => setTimeout(resolve, 1000))
            }
        }),
}

const app = new Hono()

const handler = new RPCHandler(router)

app.use('/rpc/*', createMiddleware(handler, {
    prefix: '/rpc',
}))

Bun.serve({
    static: {
        '/': Home,
    },
    fetch: app.fetch,
})

console.log('Server running on http://localhost:3000')