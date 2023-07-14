module.exports = {
  queryItem(itemLoop, itemProperty, itemValue) {
    // console.log(
    //   'queryItem | itemLoop, itemProperty, itemValue: ',
    //   itemLoop,
    //   itemProperty,
    //   itemValue,
    // );
    return itemLoop[itemProperty] === itemValue;
  },

  searchItem(itemLoop, itemProperty, itemValue) {
    // console.log(
    //   'searchItem | itemLoop, itemProperty, itemValue: ',
    //   itemLoop,
    //   itemProperty,
    //   itemValue,
    // );
    const itemLoopLowerCase = (itemLoop[itemProperty]).toLowerCase();
    const itemValueLowerCase = itemValue.toLowerCase();

    return itemLoopLowerCase.includes(itemValueLowerCase);
  },

  queryByDateRange(itemLoop, itemProperty, dateStart, dateEnd) {
    console.log(
      'queryByDateRange| itemLoop, itemProperty, dateStart, dateEnd: ',
      itemLoop,
      itemProperty,
      dateStart,
      dateEnd,
    );
    return new Date(itemLoop[itemProperty]) > new Date(dateStart)
      && new Date(itemLoop[itemProperty]) < new Date(dateEnd);
  },

  queryForeignItem(
    itemLoop,
    itemObject,
    itemProperty,
    itemValue,
  ) {
    // console.log(
    //   'queryItem | itemLoop, itemProperty, itemValue: ',
    //   itemLoop,
    //   itemProperty,
    //   itemValue,
    // );
    return itemLoop[itemObject][itemProperty] === itemValue;
  },
};
