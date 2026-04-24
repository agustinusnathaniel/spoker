import type React from 'react';

import { AutoResizeTextarea } from '~/lib/components/auto-resize-textarea';
import type { Task } from '~/lib/types/raw-db';

interface EditableFieldsProps {
  description?: string;
  handleUpdateTask: (
    field: keyof Task
  ) => (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  name?: string;
}

export const EditableFields = ({
  name,
  description,
  handleUpdateTask,
}: EditableFieldsProps) => (
  <>
    <AutoResizeTextarea
      label="Name"
      onChange={handleUpdateTask('name')}
      placeholder="Going to Mars"
      value={name}
    />
    <AutoResizeTextarea
      label="Description"
      onChange={handleUpdateTask('description')}
      placeholder="Land to Moon first"
      value={description}
    />
  </>
);
