import { GeoAddMessage, Mock, RedisBase, TraceableRedis, TraceFactoryBase, TraceSpanBase } from '../../../../src';
import { Trace } from '../../../../src/plugin/log4js/trace';

describe('src/plugin/redis/traceable.ts', () => {
    describe('.del(key: string)', () => {
        it('ok', async () => {
            const mockRedis = new Mock<RedisBase>();
            const mockTraceFactory = new Mock<TraceFactoryBase>();
            const self = new TraceableRedis(mockRedis.actual, mockTraceFactory.actual);
            self.traceID = 'trace-id';
            self.traceSpanID = 'span-id';

            const mockTrace = new Mock<Trace>();
            mockTraceFactory.expectReturn(
                r => r.build(self.traceID),
                mockTrace.actual
            );

            const mockTraceSpan = new Mock<TraceSpanBase>();
            mockTrace.expectReturn(
                r => r.createSpan(self.traceSpanID),
                mockTraceSpan.actual
            );

            mockTraceSpan.expected.begin('redis');

            mockTraceSpan.expected.addLabel('action', 'del');

            const key = 'del-key';
            mockTraceSpan.expected.addLabel('args', [key]);

            mockRedis.expectReturn(
                r => r.del(key),
                {
                    finally: cb => {
                        cb();
                    }
                }
            );

            mockTraceSpan.expectReturn(
                r => r.end(),
                {
                    catch: () => { }
                }
            );

            await self.del(key);
        });
    });

    describe('.exists(key: string): Promise<boolean>', () => {
        it('ok', async () => {
            const mockRedis = new Mock<RedisBase>();
            const mockTraceFactory = new Mock<TraceFactoryBase>();
            const self = new TraceableRedis(mockRedis.actual, mockTraceFactory.actual);
            self.traceID = 'trace-id';
            self.traceSpanID = 'span-id';

            const mockTrace = new Mock<Trace>();
            mockTraceFactory.expectReturn(
                r => r.build(self.traceID),
                mockTrace.actual
            );

            const mockTraceSpan = new Mock<TraceSpanBase>();
            mockTrace.expectReturn(
                r => r.createSpan(self.traceSpanID),
                mockTraceSpan.actual
            );

            mockTraceSpan.expected.begin('redis');

            mockTraceSpan.expected.addLabel('action', 'exists');

            const key = 'exists-key';
            mockTraceSpan.expected.addLabel('args', [key]);

            mockRedis.expectReturn(
                r => r.exists(key),
                {
                    finally: cb => {
                        cb();
                    }
                }
            );

            mockTraceSpan.expectReturn(
                r => r.end(),
                {
                    catch: () => { }
                }
            );

            await self.exists(key);
        });
    });

    describe('.expire(key: string, seconds: number)', () => {
        it('ok', async () => {
            const mockRedis = new Mock<RedisBase>();
            const mockTraceFactory = new Mock<TraceFactoryBase>();
            const self = new TraceableRedis(mockRedis.actual, mockTraceFactory.actual);
            self.traceID = 'trace-id';
            self.traceSpanID = 'span-id';

            const mockTrace = new Mock<Trace>();
            mockTraceFactory.expectReturn(
                r => r.build(self.traceID),
                mockTrace.actual
            );

            const mockTraceSpan = new Mock<TraceSpanBase>();
            mockTrace.expectReturn(
                r => r.createSpan(self.traceSpanID),
                mockTraceSpan.actual
            );

            mockTraceSpan.expected.begin('redis');

            mockTraceSpan.expected.addLabel('action', 'expire');

            const key = 'expire-key';
            const seconds = 5;
            mockTraceSpan.expected.addLabel('args', [key, seconds]);

            mockRedis.expectReturn(
                r => r.expire(key, seconds),
                {
                    finally: cb => {
                        cb();
                    }
                }
            );

            mockTraceSpan.expectReturn(
                r => r.end(),
                {
                    catch: () => { }
                }
            );

            await self.expire(key, seconds);
        });
    });

    describe('.get(key: string): Promise<string>', () => {
        it('ok', async () => {
            const mockRedis = new Mock<RedisBase>();
            const mockTraceFactory = new Mock<TraceFactoryBase>();
            const self = new TraceableRedis(mockRedis.actual, mockTraceFactory.actual);
            self.traceID = 'trace-id';
            self.traceSpanID = 'span-id';

            const mockTrace = new Mock<Trace>();
            mockTraceFactory.expectReturn(
                r => r.build(self.traceID),
                mockTrace.actual
            );

            const mockTraceSpan = new Mock<TraceSpanBase>();
            mockTrace.expectReturn(
                r => r.createSpan(self.traceSpanID),
                mockTraceSpan.actual
            );

            mockTraceSpan.expected.begin('redis');

            mockTraceSpan.expected.addLabel('action', 'get');

            const key = 'get-key';
            mockTraceSpan.expected.addLabel('args', [key]);

            mockRedis.expectReturn(
                r => r.get(key),
                {
                    finally: cb => {
                        cb();
                    }
                }
            );

            mockTraceSpan.expectReturn(
                r => r.end(),
                {
                    catch: () => { }
                }
            );

            await self.get(key);
        });
    });

    describe('.geoadd(key: string, ...messages: GeoAddMessage[]): Promise<number>', () => {
        it('ok', async () => {
            const mockRedis = new Mock<RedisBase>();
            const mockTraceFactory = new Mock<TraceFactoryBase>();
            const self = new TraceableRedis(mockRedis.actual, mockTraceFactory.actual);
            self.traceID = 'trace-id';
            self.traceSpanID = 'span-id';

            const mockTrace = new Mock<Trace>();
            mockTraceFactory.expectReturn(
                r => r.build(self.traceID),
                mockTrace.actual
            );

            const mockTraceSpan = new Mock<TraceSpanBase>();
            mockTrace.expectReturn(
                r => r.createSpan(self.traceSpanID),
                mockTraceSpan.actual
            );

            mockTraceSpan.expected.begin('redis');

            mockTraceSpan.expected.addLabel('action', 'geoadd');

            const key = 'get-key';
            const messages: GeoAddMessage[] = [{
                latitude: 1,
                longitude: 2,
                member: 'a'
            }];
            mockTraceSpan.expected.addLabel('args', [key, messages]);

            mockRedis.expectReturn(
                r => r.geoadd(key, ...messages),
                {
                    finally: cb => {
                        cb();
                    }
                }
            );

            mockTraceSpan.expectReturn(
                r => r.end(),
                {
                    catch: () => { }
                }
            );

            await self.geoadd(key, ...messages);
        });
    });

    describe('.geopos(key: string, ...members: string[]): Promise<[number, number][]>', () => {
        it('ok', async () => {
            const mockRedis = new Mock<RedisBase>();
            const mockTraceFactory = new Mock<TraceFactoryBase>();
            const self = new TraceableRedis(mockRedis.actual, mockTraceFactory.actual);
            self.traceID = 'trace-id';
            self.traceSpanID = 'span-id';

            const mockTrace = new Mock<Trace>();
            mockTraceFactory.expectReturn(
                r => r.build(self.traceID),
                mockTrace.actual
            );

            const mockTraceSpan = new Mock<TraceSpanBase>();
            mockTrace.expectReturn(
                r => r.createSpan(self.traceSpanID),
                mockTraceSpan.actual
            );

            mockTraceSpan.expected.begin('redis');

            mockTraceSpan.expected.addLabel('action', 'geopos');

            const key = 'get-key';
            const members: string[] = ['a', 'b'];
            mockTraceSpan.expected.addLabel('args', [key, members]);

            mockRedis.expectReturn(
                r => r.geopos(key, ...members),
                {
                    finally: cb => {
                        cb();
                    }
                }
            );

            mockTraceSpan.expectReturn(
                r => r.end(),
                {
                    catch: () => { }
                }
            );

            await self.geopos(key, ...members);
        });
    });

    describe('.hdel(key: string, ...fields: string[]): Promise<number>', () => {
        it('ok', async () => {
            const mockRedis = new Mock<RedisBase>();
            const mockTraceFactory = new Mock<TraceFactoryBase>();
            const self = new TraceableRedis(mockRedis.actual, mockTraceFactory.actual);
            self.traceID = 'trace-id';
            self.traceSpanID = 'span-id';

            const mockTrace = new Mock<Trace>();
            mockTraceFactory.expectReturn(
                r => r.build(self.traceID),
                mockTrace.actual
            );

            const mockTraceSpan = new Mock<TraceSpanBase>();
            mockTrace.expectReturn(
                r => r.createSpan(self.traceSpanID),
                mockTraceSpan.actual
            );

            mockTraceSpan.expected.begin('redis');

            mockTraceSpan.expected.addLabel('action', 'hdel');

            const key = 'hdel-key';
            const fields: string[] = ['a', 'b'];
            mockTraceSpan.expected.addLabel('args', [key, fields]);

            mockRedis.expectReturn(
                r => r.hdel(key, ...fields),
                {
                    finally: cb => {
                        cb();
                    }
                }
            );

            mockTraceSpan.expectReturn(
                r => r.end(),
                {
                    catch: () => { }
                }
            );

            await self.hdel(key, ...fields);
        });
    });

    describe('.hget(key: string, field: string): Promise<string>', () => {
        it('ok', async () => {
            const mockRedis = new Mock<RedisBase>();
            const mockTraceFactory = new Mock<TraceFactoryBase>();
            const self = new TraceableRedis(mockRedis.actual, mockTraceFactory.actual);
            self.traceID = 'trace-id';
            self.traceSpanID = 'span-id';

            const mockTrace = new Mock<Trace>();
            mockTraceFactory.expectReturn(
                r => r.build(self.traceID),
                mockTrace.actual
            );

            const mockTraceSpan = new Mock<TraceSpanBase>();
            mockTrace.expectReturn(
                r => r.createSpan(self.traceSpanID),
                mockTraceSpan.actual
            );

            mockTraceSpan.expected.begin('redis');

            mockTraceSpan.expected.addLabel('action', 'hget');

            const key = 'hget-key';
            const field = 'a';
            mockTraceSpan.expected.addLabel('args', [key, field]);

            mockRedis.expectReturn(
                r => r.hget(key, field),
                {
                    finally: cb => {
                        cb();
                    }
                }
            );

            mockTraceSpan.expectReturn(
                r => r.end(),
                {
                    catch: () => { }
                }
            );

            await self.hget(key, field);
        });
    });

    describe('.hgetall(key: string): Promise<{ [key: string]: string; }>', () => {
        it('ok', async () => {
            const mockRedis = new Mock<RedisBase>();
            const mockTraceFactory = new Mock<TraceFactoryBase>();
            const self = new TraceableRedis(mockRedis.actual, mockTraceFactory.actual);
            self.traceID = 'trace-id';
            self.traceSpanID = 'span-id';

            const mockTrace = new Mock<Trace>();
            mockTraceFactory.expectReturn(
                r => r.build(self.traceID),
                mockTrace.actual
            );

            const mockTraceSpan = new Mock<TraceSpanBase>();
            mockTrace.expectReturn(
                r => r.createSpan(self.traceSpanID),
                mockTraceSpan.actual
            );

            mockTraceSpan.expected.begin('redis');

            mockTraceSpan.expected.addLabel('action', 'hgetall');

            const key = 'hgetall-key';
            mockTraceSpan.expected.addLabel('args', [key]);

            mockRedis.expectReturn(
                r => r.hgetall(key),
                {
                    finally: cb => {
                        cb();
                    }
                }
            );

            mockTraceSpan.expectReturn(
                r => r.end(),
                {
                    catch: () => { }
                }
            );

            await self.hgetall(key);
        });
    });

    describe('.hlen(key: string): Promise<number>', () => {
        it('ok', async () => {
            const mockRedis = new Mock<RedisBase>();
            const mockTraceFactory = new Mock<TraceFactoryBase>();
            const self = new TraceableRedis(mockRedis.actual, mockTraceFactory.actual);
            self.traceID = 'trace-id';
            self.traceSpanID = 'span-id';

            const mockTrace = new Mock<Trace>();
            mockTraceFactory.expectReturn(
                r => r.build(self.traceID),
                mockTrace.actual
            );

            const mockTraceSpan = new Mock<TraceSpanBase>();
            mockTrace.expectReturn(
                r => r.createSpan(self.traceSpanID),
                mockTraceSpan.actual
            );

            mockTraceSpan.expected.begin('redis');

            mockTraceSpan.expected.addLabel('action', 'hlen');

            const key = 'hlen-key';
            mockTraceSpan.expected.addLabel('args', [key]);

            mockRedis.expectReturn(
                r => r.hlen(key),
                {
                    finally: cb => {
                        cb();
                    }
                }
            );

            mockTraceSpan.expectReturn(
                r => r.end(),
                {
                    catch: () => { }
                }
            );

            await self.hlen(key);
        });
    });

    describe('.hkeys(key: string): Promise<string[]>', () => {
        it('ok', async () => {
            const mockRedis = new Mock<RedisBase>();
            const mockTraceFactory = new Mock<TraceFactoryBase>();
            const self = new TraceableRedis(mockRedis.actual, mockTraceFactory.actual);
            self.traceID = 'trace-id';
            self.traceSpanID = 'span-id';

            const mockTrace = new Mock<Trace>();
            mockTraceFactory.expectReturn(
                r => r.build(self.traceID),
                mockTrace.actual
            );

            const mockTraceSpan = new Mock<TraceSpanBase>();
            mockTrace.expectReturn(
                r => r.createSpan(self.traceSpanID),
                mockTraceSpan.actual
            );

            mockTraceSpan.expected.begin('redis');

            mockTraceSpan.expected.addLabel('action', 'hkeys');

            const key = 'hkeys-key';
            mockTraceSpan.expected.addLabel('args', [key]);

            mockRedis.expectReturn(
                r => r.hkeys(key),
                {
                    finally: cb => {
                        cb();
                    }
                }
            );

            mockTraceSpan.expectReturn(
                r => r.end(),
                {
                    catch: () => { }
                }
            );

            await self.hkeys(key);
        });
    });

    describe('.hset(key: string, field: string, value: string)', () => {
        it('ok', async () => {
            const mockRedis = new Mock<RedisBase>();
            const mockTraceFactory = new Mock<TraceFactoryBase>();
            const self = new TraceableRedis(mockRedis.actual, mockTraceFactory.actual);
            self.traceID = 'trace-id';
            self.traceSpanID = 'span-id';

            const mockTrace = new Mock<Trace>();
            mockTraceFactory.expectReturn(
                r => r.build(self.traceID),
                mockTrace.actual
            );

            const mockTraceSpan = new Mock<TraceSpanBase>();
            mockTrace.expectReturn(
                r => r.createSpan(self.traceSpanID),
                mockTraceSpan.actual
            );

            mockTraceSpan.expected.begin('redis');

            mockTraceSpan.expected.addLabel('action', 'hset');

            const key = 'hset-key';
            const field = 'f';
            const value = 'v';
            mockTraceSpan.expected.addLabel('args', [key, field, value]);

            mockRedis.expectReturn(
                r => r.hset(key, field, value),
                {
                    finally: cb => {
                        cb();
                    }
                }
            );

            mockTraceSpan.expectReturn(
                r => r.end(),
                {
                    catch: () => { }
                }
            );

            await self.hset(key, field, value);
        });
    });

    describe('.hsetnx(key: string, field: string, value: string): Promise<boolean>', () => {
        it('ok', async () => {
            const mockRedis = new Mock<RedisBase>();
            const mockTraceFactory = new Mock<TraceFactoryBase>();
            const self = new TraceableRedis(mockRedis.actual, mockTraceFactory.actual);
            self.traceID = 'trace-id';
            self.traceSpanID = 'span-id';

            const mockTrace = new Mock<Trace>();
            mockTraceFactory.expectReturn(
                r => r.build(self.traceID),
                mockTrace.actual
            );

            const mockTraceSpan = new Mock<TraceSpanBase>();
            mockTrace.expectReturn(
                r => r.createSpan(self.traceSpanID),
                mockTraceSpan.actual
            );

            mockTraceSpan.expected.begin('redis');

            mockTraceSpan.expected.addLabel('action', 'hsetnx');

            const key = 'hsetnx-key';
            const field = 'f';
            const value = 'v';
            mockTraceSpan.expected.addLabel('args', [key, field, value]);

            mockRedis.expectReturn(
                r => r.hsetnx(key, field, value),
                {
                    finally: cb => {
                        cb();
                    }
                }
            );

            mockTraceSpan.expectReturn(
                r => r.end(),
                {
                    catch: () => { }
                }
            );

            await self.hsetnx(key, field, value);
        });
    });

    describe('.incr(key: string): Promise<number>', () => {
        it('ok', async () => {
            const mockRedis = new Mock<RedisBase>();
            const mockTraceFactory = new Mock<TraceFactoryBase>();
            const self = new TraceableRedis(mockRedis.actual, mockTraceFactory.actual);
            self.traceID = 'trace-id';
            self.traceSpanID = 'span-id';

            const mockTrace = new Mock<Trace>();
            mockTraceFactory.expectReturn(
                r => r.build(self.traceID),
                mockTrace.actual
            );

            const mockTraceSpan = new Mock<TraceSpanBase>();
            mockTrace.expectReturn(
                r => r.createSpan(self.traceSpanID),
                mockTraceSpan.actual
            );

            mockTraceSpan.expected.begin('redis');

            mockTraceSpan.expected.addLabel('action', 'incr');

            const key = 'incr-key';
            mockTraceSpan.expected.addLabel('args', [key]);

            mockRedis.expectReturn(
                r => r.incr(key),
                {
                    finally: cb => {
                        cb();
                    }
                }
            );

            mockTraceSpan.expectReturn(
                r => r.end(),
                {
                    catch: () => { }
                }
            );

            await self.incr(key);
        });
    });

    describe('.lpush(key: string, ...values: string[]): Promise<number>', () => {
        it('ok', async () => {
            const mockRedis = new Mock<RedisBase>();
            const mockTraceFactory = new Mock<TraceFactoryBase>();
            const self = new TraceableRedis(mockRedis.actual, mockTraceFactory.actual);
            self.traceID = 'trace-id';
            self.traceSpanID = 'span-id';

            const mockTrace = new Mock<Trace>();
            mockTraceFactory.expectReturn(
                r => r.build(self.traceID),
                mockTrace.actual
            );

            const mockTraceSpan = new Mock<TraceSpanBase>();
            mockTrace.expectReturn(
                r => r.createSpan(self.traceSpanID),
                mockTraceSpan.actual
            );

            mockTraceSpan.expected.begin('redis');

            mockTraceSpan.expected.addLabel('action', 'lpush');

            const key = 'lpush-key';
            const values = ['a', 'b'];
            mockTraceSpan.expected.addLabel('args', [key, values]);

            mockRedis.expectReturn(
                r => r.lpush(key, ...values),
                {
                    finally: cb => {
                        cb();
                    }
                }
            );

            mockTraceSpan.expectReturn(
                r => r.end(),
                {
                    catch: () => { }
                }
            );

            await self.lpush(key, ...values);
        });
    });

    describe('.lrange(key: string, start: number, stop: number): Promise<string[]>', () => {
        it('ok', async () => {
            const mockRedis = new Mock<RedisBase>();
            const mockTraceFactory = new Mock<TraceFactoryBase>();
            const self = new TraceableRedis(mockRedis.actual, mockTraceFactory.actual);
            self.traceID = 'trace-id';
            self.traceSpanID = 'span-id';

            const mockTrace = new Mock<Trace>();
            mockTraceFactory.expectReturn(
                r => r.build(self.traceID),
                mockTrace.actual
            );

            const mockTraceSpan = new Mock<TraceSpanBase>();
            mockTrace.expectReturn(
                r => r.createSpan(self.traceSpanID),
                mockTraceSpan.actual
            );

            mockTraceSpan.expected.begin('redis');

            mockTraceSpan.expected.addLabel('action', 'lrange');

            const key = 'lrange-key';
            const start = 1;
            const stop = 5;
            mockTraceSpan.expected.addLabel('args', [key, start, stop]);

            mockRedis.expectReturn(
                r => r.lrange(key, start, stop),
                {
                    finally: cb => {
                        cb();
                    }
                }
            );

            mockTraceSpan.expectReturn(
                r => r.end(),
                {
                    catch: () => { }
                }
            );

            await self.lrange(key, start, stop);
        });
    });

    describe('.mget(...keys: string[]): Promise<string[]>', () => {
        it('ok', async () => {
            const mockRedis = new Mock<RedisBase>();
            const mockTraceFactory = new Mock<TraceFactoryBase>();
            const self = new TraceableRedis(mockRedis.actual, mockTraceFactory.actual);
            self.traceID = 'trace-id';
            self.traceSpanID = 'span-id';

            const mockTrace = new Mock<Trace>();
            mockTraceFactory.expectReturn(
                r => r.build(self.traceID),
                mockTrace.actual
            );

            const mockTraceSpan = new Mock<TraceSpanBase>();
            mockTrace.expectReturn(
                r => r.createSpan(self.traceSpanID),
                mockTraceSpan.actual
            );

            mockTraceSpan.expected.begin('redis');

            mockTraceSpan.expected.addLabel('action', 'mget');

            const keys = ['mget-key-1', 'mget-key-2'];
            mockTraceSpan.expected.addLabel('args', [keys]);

            mockRedis.expectReturn(
                r => r.mget(...keys),
                {
                    finally: cb => {
                        cb();
                    }
                }
            );

            mockTraceSpan.expectReturn(
                r => r.end(),
                {
                    catch: () => { }
                }
            );

            await self.mget(...keys);
        });
    });

    describe('.rpop(key: string): Promise<string>', () => {
        it('ok', async () => {
            const mockRedis = new Mock<RedisBase>();
            const mockTraceFactory = new Mock<TraceFactoryBase>();
            const self = new TraceableRedis(mockRedis.actual, mockTraceFactory.actual);
            self.traceID = 'trace-id';
            self.traceSpanID = 'span-id';

            const mockTrace = new Mock<Trace>();
            mockTraceFactory.expectReturn(
                r => r.build(self.traceID),
                mockTrace.actual
            );

            const mockTraceSpan = new Mock<TraceSpanBase>();
            mockTrace.expectReturn(
                r => r.createSpan(self.traceSpanID),
                mockTraceSpan.actual
            );

            mockTraceSpan.expected.begin('redis');

            mockTraceSpan.expected.addLabel('action', 'rpop');

            const key = 'rpop-key';
            mockTraceSpan.expected.addLabel('args', [key]);

            mockRedis.expectReturn(
                r => r.rpop(key),
                {
                    finally: cb => {
                        cb();
                    }
                }
            );

            mockTraceSpan.expectReturn(
                r => r.end(),
                {
                    catch: () => { }
                }
            );

            await self.rpop(key);
        });
    });

    describe('.rpush(key: string, ...values: string[]): Promise<number>', () => {
        it('ok', async () => {
            const mockRedis = new Mock<RedisBase>();
            const mockTraceFactory = new Mock<TraceFactoryBase>();
            const self = new TraceableRedis(mockRedis.actual, mockTraceFactory.actual);
            self.traceID = 'trace-id';
            self.traceSpanID = 'span-id';

            const mockTrace = new Mock<Trace>();
            mockTraceFactory.expectReturn(
                r => r.build(self.traceID),
                mockTrace.actual
            );

            const mockTraceSpan = new Mock<TraceSpanBase>();
            mockTrace.expectReturn(
                r => r.createSpan(self.traceSpanID),
                mockTraceSpan.actual
            );

            mockTraceSpan.expected.begin('redis');

            mockTraceSpan.expected.addLabel('action', 'rpush');

            const key = 'rpush-key';
            const values = ['a', 'b'];
            mockTraceSpan.expected.addLabel('args', [key, values]);

            mockRedis.expectReturn(
                r => r.rpush(key, ...values),
                {
                    finally: cb => {
                        cb();
                    }
                }
            );

            mockTraceSpan.expectReturn(
                r => r.end(),
                {
                    catch: () => { }
                }
            );

            await self.rpush(key, ...values);
        });
    });

    describe('.set(key: string, value: string, ...args: any[]): Promise<boolean>', () => {
        it('ok', async () => {
            const mockRedis = new Mock<RedisBase>();
            const mockTraceFactory = new Mock<TraceFactoryBase>();
            const self = new TraceableRedis(mockRedis.actual, mockTraceFactory.actual);
            self.traceID = 'trace-id';
            self.traceSpanID = 'span-id';

            const mockTrace = new Mock<Trace>();
            mockTraceFactory.expectReturn(
                r => r.build(self.traceID),
                mockTrace.actual
            );

            const mockTraceSpan = new Mock<TraceSpanBase>();
            mockTrace.expectReturn(
                r => r.createSpan(self.traceSpanID),
                mockTraceSpan.actual
            );

            mockTraceSpan.expected.begin('redis');

            mockTraceSpan.expected.addLabel('action', 'set');

            const key = 'set-key';
            const value = 'v';
            const args = ['ex', 1];
            mockTraceSpan.expected.addLabel('args', [key, value, args]);

            mockRedis.expectReturn(
                r => r.set(key, value, ...args),
                {
                    finally: cb => {
                        cb();
                    }
                }
            );

            mockTraceSpan.expectReturn(
                r => r.end(),
                {
                    catch: () => { }
                }
            );

            await self.set(key, value, ...args);
        });
    });

    describe('.time(): Promise<[string, string]>', () => {
        it('ok', async () => {
            const mockRedis = new Mock<RedisBase>();
            const mockTraceFactory = new Mock<TraceFactoryBase>();
            const self = new TraceableRedis(mockRedis.actual, mockTraceFactory.actual);
            self.traceID = 'trace-id';
            self.traceSpanID = 'span-id';

            const mockTrace = new Mock<Trace>();
            mockTraceFactory.expectReturn(
                r => r.build(self.traceID),
                mockTrace.actual
            );

            const mockTraceSpan = new Mock<TraceSpanBase>();
            mockTrace.expectReturn(
                r => r.createSpan(self.traceSpanID),
                mockTraceSpan.actual
            );

            mockTraceSpan.expected.begin('redis');

            mockTraceSpan.expected.addLabel('action', 'time');

            mockRedis.expectReturn(
                r => r.time(),
                {
                    finally: cb => {
                        cb();
                    }
                }
            );

            mockTraceSpan.expectReturn(
                r => r.end(),
                {
                    catch: () => { }
                }
            );

            await self.time();
        });
    });

    describe('.ttl(key: string): Promise<number>', () => {
        it('ok', async () => {
            const mockRedis = new Mock<RedisBase>();
            const mockTraceFactory = new Mock<TraceFactoryBase>();
            const self = new TraceableRedis(mockRedis.actual, mockTraceFactory.actual);
            self.traceID = 'trace-id';
            self.traceSpanID = 'span-id';

            const mockTrace = new Mock<Trace>();
            mockTraceFactory.expectReturn(
                r => r.build(self.traceID),
                mockTrace.actual
            );

            const mockTraceSpan = new Mock<TraceSpanBase>();
            mockTrace.expectReturn(
                r => r.createSpan(self.traceSpanID),
                mockTraceSpan.actual
            );

            mockTraceSpan.expected.begin('redis');

            mockTraceSpan.expected.addLabel('action', 'ttl');

            const key = 'ttl-key';
            mockTraceSpan.expected.addLabel('args', [key]);

            mockRedis.expectReturn(
                r => r.ttl(key),
                {
                    finally: cb => {
                        cb();
                    }
                }
            );

            mockTraceSpan.expectReturn(
                r => r.end(),
                {
                    catch: () => { }
                }
            );

            await self.ttl(key);
        });
    });
});