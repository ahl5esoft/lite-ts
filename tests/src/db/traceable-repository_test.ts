import { DBRepositoryBase, Mock } from '../../../src';
import { TraceableDBRepository } from '../../../src/db/traceable-repository';

class Model { }

describe('src/db/traceable-repository.ts', () => {
    describe('.query(): DBQueryBase<T>', () => {
        it('ok', () => {
            const mockRepostry = new Mock<DBRepositoryBase<Model>>();
            const self = new TraceableDBRepository(mockRepostry.actual, null, '', null, '', null);

            mockRepostry.expectReturn(
                r => r.query(),
                null
            );

            self.query();
        });
    });
});