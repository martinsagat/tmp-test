/**
 * Returns a greeting message "hello world".
 * @returns {string} The greeting message.
 */
exports.example = () => 'hello world';

/**
 * Removes specified properties from each object in the array.
 * @param {string[]} propsToRemove - The properties to remove.
 * @param {object[]} arr - The array of objects.
 * @returns {object[]} The array with specified properties removed.
 */
exports.stripPrivateProperties = (propsToRemove, arr) => {
  return arr.map(obj => {
    for (const prop of propsToRemove) {
      delete obj[prop];
    }
    return obj;
  });
};

/**
 * Excludes objects from the array based on a specified property.
 * @param {string} propToExclude - The property to exclude by.
 * @param {object[]} arr - The array of objects.
 * @returns {object[]} The array with objects excluded based on the property.
 */
exports.excludeByProperty = (propToExclude, arr) => {
  return arr.filter(obj => !obj.hasOwnProperty(propToExclude));
};

/**
 * Calculates the sum of 'val' property for each 'objects' array in the input array.
 * @param {object[]} array - The array of objects with 'objects' property.
 * @returns {object[]} The array with sums of 'val' property.
 */
exports.sumDeep = (array) => {
  return array.map((item) => ({
    objects: item.objects.reduce((sum, obj) => sum + obj.val, 0),
  }));
};

/**
 * Applies colors to statuses based on the provided mapping.
 * @param {object} colorMapping - The mapping of status codes to colors.
 * @param {object[]} statuses - The array of objects with 'status' property.
 * @param {string} [defaultColor='gray'] - The default color if no mapping is found.
 * @returns {object[]} The array with colors applied to statuses.
 */
exports.applyStatusColor = (colorMapping, statuses, defaultColor = 'gray') => {
  return statuses
    .map(statusObj => {
      const [color] = Object.entries(colorMapping).find(([_, codes]) => codes.includes(statusObj.status)) || [];
      return {
        ...statusObj,
        color: color || defaultColor,
      };
    })
    .filter(statusObj => statusObj.color !== defaultColor);
};

/**
 * Creates a greeting function based on the provided greet function and default greeting.
 * @param {function} greetFunction - The greet function.
 * @param {string} defaultGreeting - The default greeting.
 * @returns {function} A greeting function that takes a name parameter.
 */
exports.createGreeting = (greetFunction, defaultGreeting) => {
  return (name) => greetFunction(defaultGreeting, name);
};

/**
 * Sets default properties for a user object.
 * @param {object} defaultProps - The default properties to set.
 * @returns {function} A function that takes a user object and sets default properties.
 */
exports.setDefaults = (defaultProps) => {
  return (user) => {
    return {
      ...defaultProps,
      ...user,
    };
  };
};

/**
 * Asynchronously fetches company, status, and user information based on a user name.
 * @param {string} userName - The user name to fetch information for.
 * @param {object} services - The services object with fetch methods.
 * @returns {Promise<object>} A promise resolving to an object with company, status, and user information.
 */
exports.fetchUserByNameAndUsersCompany = async (userName, services) => {
  const result = await Promise.all([
    await services.fetchCompanyById(
      (await services.fetchUsers()).find(user => user.name === userName).companyId
    ),
    await services.fetchStatus(),
    (await services.fetchUsers()).find(user => user.name === userName),
  ]);

  const [company, status, user] = result;

  return { company, status, user };
};
