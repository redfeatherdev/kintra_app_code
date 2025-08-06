import { XIcon } from 'lucide-react';
import { ActionIcon, Drawer, Text, Title } from 'rizzui';
import { useDrawer } from '../../../store/drawer.store';

export const CustomDrawer = () => {
  const { open, closeDrawer, component, title, description, props } = useDrawer();

  const Component = component;
  const hasProps = props && Object.keys(props).length > 0;

  return (
    <Drawer
      isOpen={open}
      onClose={closeDrawer}
      overlayClassName="!opacity-30 dark:!opacity-50"
      containerClassName={`dark:bg-steel-800 max-w-md bg-white`}
    >
      <div className="flex flex-col items-stretch justify-start h-[100dvh] w-full relative gap-0">
        <div className="flex justify-between items-start sticky top-0 left-0 w-full px-6 py-5 border-b border-steel-100 dark:border-steel-600 bg-steel-50/30 dark:bg-steel-700">
          <div className="flex flex-col justify-start items-stretch gap-0.5">
            <Title className="capitalize text-xl font-semibold text-black dark:text-white">
              {title}
            </Title>
            {description && (
              <Text className="text-black dark:text-white text-sm">
                {description}
              </Text>
            )}
          </div>

          <ActionIcon
            variant="text"
            onClick={closeDrawer}
            className="w-auto h-auto py-0"
          >
            <XIcon
              className="transition-all text-steel-500 dark:text-steel-400 hover:text-steel-600 dark:hover:text-steel-300"
              strokeWidth={1.5}
              size={24}
            />
          </ActionIcon>
        </div>

        {component && (
          <div className="flex flex-col items-stretch justify-start flex-1 overflow-y-auto">
            {hasProps ? <Component {...props} /> : <Component />}
          </div>
        )}
      </div>
    </Drawer>
  );
};
