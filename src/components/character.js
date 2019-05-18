export const Character = {
  properties: {
    x: 0,
    y: 0,
    arms: 2,
    heads: 1,
    legs: 2
  }
};

export const Health = {
  properties: {
    max: 30,
    hp: 30
  }
}

export const Player = {
  properties: {
    selectedItem: '<Entity>',
    selectedComponent: '<Component>',
    selectedField: ''
  }
};

export const Inventory = {
  properties: {
    max: 20,
    slots: '<EntitySet>'
  }
}

export const EquipmentSlot = {
  properties: {
    description: 'shoulders',
    name: 'shoulders',
    slotType: 'shoulders',
    slot: '<Entity>'
  },
  multiset: true,
  mapBy: 'name'
}

export const Action = {
  properties: {
    action: null,
    subject: '<Entity>',
    target: '<Entity>'
  },
  multiset: true
}

export const Description = {
  properties: {
    text: '',
    name: ''
  }
}
