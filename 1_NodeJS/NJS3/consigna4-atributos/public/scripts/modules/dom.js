// junto botones, contenedor y log
export function getAttributeElements() {
  return {
    createButtons: [1, 2, 3, 4, 5].map((i) => document.getElementById(`create-node-${i}-btn`)),
    editButtons: [1, 2, 3, 4, 5].map((i) => document.getElementById(`edit-node-${i}-btn`)),
    nodesContainer: document.getElementById('nodes-container'),
    changesLog: document.getElementById('changes-log')
  };
}
