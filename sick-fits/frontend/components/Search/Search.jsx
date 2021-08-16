import { DropDown, DropDownItem, SearchStyles as SearchStyled } from '../styles/DropDown';
import { resetIdCounter, useCombobox } from 'downshift';
import { useLazyQuery } from '@apollo/client';
import debounce from 'lodash.debounce';
import gql from 'graphql-tag';
import {useRouter} from 'next/router';

const SEARCH_PRODUCTS_QUERY = gql`
    query SEARCH_PRODUCTS_QUERY($searchTerm: String!) {
  allProducts(
    where: {
      OR: [
        { name_contains_i: $searchTerm }
        { description_contains_i: $searchTerm }
      ]
    }
  ) {
    id
    name
    photo {
      image {
        publicUrlTransformed
      }
    }
  }
}`;

export default function Search() {
    const [findItems, { error, loading, data }] = useLazyQuery(SEARCH_PRODUCTS_QUERY, {
        fetchPolicy: 'no-cache',
    });

    const router = useRouter();

    resetIdCounter(); // Takes care of SSR issues regarding misaligned class names
    
    const items = data?.allProducts || [];
    
    const findItemsButChill = debounce(findItems, 350);

    const { getMenuProps, getInputProps, getComboboxProps, inputValue, getItemProps, highlightedIndex, isOpen } = useCombobox({
        items,
        onInputValueChange: async () => {
            findItemsButChill({
                variables : {
                    searchTerm: inputValue
                }
            });
        },
        onSelectedItemChange: ({ selectedItem }) => {
          router.push({
            pathname: `/product/${selectedItem.id}`
          });
        },
        itemToString: item => item?.name ?? '',
    });

    return (
        <SearchStyled>
            <div {...getComboboxProps()}>
                <input 
                {...getInputProps({
                    type: "search",
                    placeholder: "Search for an item",
                    id: 'search',
                    className: loading ? 'loading' : '',

                })} />
            </div>
            <DropDown {...getMenuProps()}>
                {isOpen && data?.allProducts?.map((item, index) => (
                    <DropDownItem key={item.id} {...getItemProps({ item })} highlighted={index === highlightedIndex}>
                        <img src={item.photo.image.publicUrlTransformed} alt={item.name} width="50"/>
                        {item.name}
                    </DropDownItem>
                ))}
                {isOpen && !items.length && !loading && (
                  <DropDownItem>No items found for {inputValue}</DropDownItem>
                )}
            </DropDown>
        </SearchStyled>
    );
}
