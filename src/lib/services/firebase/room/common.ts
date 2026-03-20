import { getDatabase, ref } from 'firebase/database';

import { fbase } from '~/lib/services/firebase/client';

const database = getDatabase(fbase);

export const roomsData = ref(database, 'rooms');
