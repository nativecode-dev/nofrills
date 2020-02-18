import { Subject, Subscription } from 'rxjs'

import { Merge } from './Utilities/Merge'
import { LincolnMessage } from './LincolnMessage'
import { LincolnEnvelope } from './LincolnEnvelope'
import { LincolnOptions } from './LincolnOptions'

export class Lincoln extends Subject<LincolnEnvelope> {
  private readonly namespace: string[]
  private readonly options: LincolnOptions
  private readonly subscriptions: Subscription[] = []

  constructor(options: Partial<LincolnOptions>) {
    super()
    this.options = Merge<LincolnOptions>(options)
    this.namespace = this.options.namespace.split(this.options.namespaceSeparator)
  }

  get namespaceStr(): string {
    return this.namespace.join(this.options.namespaceSeparator)
  }

  close(): void {
    return this.subscriptions.slice().forEach((sub, index) => {
      delete this.subscriptions[index]
      sub.unsubscribe()
    })
  }

  extend(namespace: string): Lincoln {
    const ns = this.namespace.concat(namespace.split(this.options.namespaceSeparator))

    const options = Merge<LincolnOptions>(this.options, {
      namespace: ns.join(this.options.namespaceSeparator),
    })

    const lincoln = new Lincoln(options)
    const subscription = lincoln.subscribe(this.next, this.error, this.complete)
    this.subscriptions.push(subscription)

    return lincoln
  }

  write(message: LincolnMessage): void {
    const envelope: LincolnEnvelope = {
      message,
      created: new Date(),
      namespace: this.namespace.join(this.options.namespaceSeparator),
    }

    return this.next(envelope)
  }
}
