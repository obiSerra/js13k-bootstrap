export default function createEntity(entity) {
  const baseEntity = {
    id: Math.random() * 10000,
    run: (gameState, entity) => entity,
    render: () => null,
  };

  return { ...baseEntity, ...entity };
}
