module.exports = function itemsByDateOrder(items, itemPropertyName) {
  function sortListDate(itemPrimary, itemSecundary) {
    const itemPrimaryValue = itemPrimary[itemPropertyName];
    const itemSecundaryValue = itemSecundary[itemPropertyName];
    // console.log('sortListDate | itemPrimaryValue, itemSecundaryValue: ', itemSecundaryValue);
    const itemPrimaryValueInDatetime = new Date(itemPrimaryValue);
    const itemSecundaryValueInDatetime = new Date(itemSecundaryValue);
    // console.log(
    //   'sortListDate | itemPrimaryValueInDatetime, itemSecundaryValueInDatetime: ',
    //   itemPrimaryValueInDatetime,
    //   itemSecundaryValueInDatetime,
    // );

    return itemSecundaryValueInDatetime - itemPrimaryValueInDatetime;
  }

  const itemsDateOrder = items.sort(sortListDate);
  // console.log('itemsByDateOrder | itemsDateOrder: ', itemsDateOrder);

  return itemsDateOrder;
};
