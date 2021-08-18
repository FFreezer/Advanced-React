import { list } from '@keystone-next/keystone/schema';
import { text, relationship, select, integer } from '@keystone-next/fields';
import { isSignedIn, permissions } from '../access';

export const Product = list({
  access: {
    create: isSignedIn,
    read: true,
    update: isSignedIn,
    delete: isSignedIn,
  },
  fields: {
    name: text({ isRequired: true }),
    description: text({
      ui: {
        displayMode: 'textarea',
      },
    }),
    photo: relationship({
      ref: 'ProductImage.product',
      ui: {
        displayMode: 'cards',
        cardFields: ['image', 'altText'],
        inlineCreate: { fields: ['image', 'altText'] },
        inlineEdit: { fields: ['image', 'altText'] },
      },
    }),
    status: select({
      options: [
        { label: 'DRAFT', value: 'DRAFT' },
        { label: 'AVAILABLE', value: 'AVAILABLE' },
        { label: 'UNAVAILABLE', value: 'UNAVAILABLE' },
      ],
      defaultValue: 'DRAFT',
      ui: {
        displayMode: 'segmented-control',
        createView: { fieldMode: 'hidden' },
      },
    }),
    price: integer(),
  },
});
