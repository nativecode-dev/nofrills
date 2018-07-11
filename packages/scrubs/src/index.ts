export * from './Registry'
export * from './Scrubs'
export * from './ScrubsInterceptor'

import { Registry } from './Registry'
import { ArrayScrubber, KeyValueScrubber, ObjectScrubber, UrlScrubber } from './Scrubbers'

Registry.register<any[]>('array', ArrayScrubber)
Registry.register<any>('object', ObjectScrubber)
Registry.register<string>('string', KeyValueScrubber)
Registry.register<string>('string', UrlScrubber)
