import { Button, Input } from 'rizzui';
import { Box } from '../Box';
import { Flex } from '../Flex';
import { useDrawer } from '../../../store/drawer.store';
import { FixedDrawerBottom } from '../FixedDrawerBottom';

export const CreateUserForm = () => {
  const { closeDrawer } = useDrawer();

  return (
    <Flex direction="col" align="stretch" className="gap-0 p-6 pb-24">

      <Flex direction="col" align="stretch" className="gap-5">
        <Box>
          <Input
            type="text"
            name='name'
            label="Name"
            placeholder="Enter name"
            className="[&_.rizzui-input-container]:bg-transparent [&_.rizzui-input-container_input]:w-full"
            inputClassName="px-3 border-[1.5px] ring-0 border-stroke [&.is-focus]:border-primary [&.is-hover]:border-primary dark:border-strokedark mt-2"
          />
        </Box>

        <Box>
          <Input
            type="text"
            name='email'
            label="Email"
            placeholder="Enter email"
            className="[&_.rizzui-input-container]:bg-transparent [&_.rizzui-input-container_input]:w-full"
            inputClassName="px-3 border-[1.5px] ring-0 border-stroke [&.is-focus]:border-primary [&.is-hover]:border-primary dark:border-strokedark mt-2"
          />
        </Box>

        <Box>
          <Input
            type="number"
            name='email'
            label="Age"
            placeholder="Enter age"
            className="[&_.rizzui-input-container]:bg-transparent [&_.rizzui-input-container_input]:w-full"
            inputClassName="px-3 border-[1.5px] ring-0 border-stroke [&.is-focus]:border-primary [&.is-hover]:border-primary dark:border-strokedark mt-2"
          />
        </Box>

        <Box>
          <Input
            type="number"
            name='attractiveness'
            label="Attractiveness"
            placeholder="Enter attractiveness"
            className="[&_.rizzui-input-container]:bg-transparent [&_.rizzui-input-container_input]:w-full"
            inputClassName="px-3 border-[1.5px] ring-0 border-stroke [&.is-focus]:border-primary [&.is-hover]:border-primary dark:border-strokedark mt-2"
          />
        </Box>

        <Box>
          <Input
            type="number"
            name='score'
            label="Kintr Score"
            placeholder="Enter your score"
            className="[&_.rizzui-input-container]:bg-transparent [&_.rizzui-input-container_input]:w-full"
            inputClassName="px-3 border-[1.5px] ring-0 border-stroke [&.is-focus]:border-primary [&.is-hover]:border-primary dark:border-strokedark mt-2"
          />
        </Box>

        <FixedDrawerBottom>
          <Button
            type="button"
            size="lg"
            variant="outline"
            className='border-stroke dark:border-strokedark hover:text-black'
            onClick={closeDrawer}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            size="lg"
            className="w-full disabled:bg-[#F8F9FB] text-white bg-primary hover:opacity-90"
          >
            Save
          </Button>
        </FixedDrawerBottom>
      </Flex>
    </Flex>
  );
};
