import { list } from '@keystone-next/keystone/schema';
import { text, password, relationship } from '@keystone-next/fields';

export const User = list({
  // access
  // ui
  fields: {
    name: text({ isRequired: true, isIndexed: true }),
    email: text({ isRequired: true, isUnique: true }),
    password: password(),
    cart: relationship({
      ref: 'CartItem.user',
      many: true,
      ui: {
        createView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'read' },
      },
    }),
    orders: relationship({
      ref: 'Order.user',
      many: true,
    }),
    role: relationship({
      ref: 'Role.assignedTo',
      many: true,
      // TODO Add access control
    }),
    products: relationship({
      ref: 'Product.user',
      many: true,
    }),
  },
});
