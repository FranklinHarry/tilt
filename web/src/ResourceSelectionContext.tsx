import { createContext, PropsWithChildren, useContext, useState } from "react"
import { ResourceListOptionsProvider } from "./ResourceListOptionsContext"

/**
 * The ResourceSelection state keeps track of filters and sorting
 * that are applied to resource lists and used across views (with exceptions).
 *
 * As the persistent options for resource listing change, this context may
 * need to be refactored or reconsidered.
 */

type ResourceSelectionContext = {
  selected: Set<string>
  isSelected: (resourceName: string) => boolean
  select: (resourceName: string) => void
  deselect: (resourceName: string) => void
  getSelections: () => string[]
  clearSelections: () => void
}

// Will adding and deleting entries from a set be enough for react to re-render?
// I may need to refactor to a string[] data set

const ResourceSelectionContext = createContext<ResourceSelectionContext>({
  selected: new Set(),
  isSelected: (_resourceName: string) => {
    console.warn("Resource selections context is not set.")
    return false
  },
  select: (_resourceName: string) => {
    console.warn("Resource selections context is not set.")
  },
  deselect: (_resourceName: string) => {
    console.warn("Resource selections context is not set.")
  },
  getSelections: () => {
    console.warn("Resource selections context is not set.")
    return []
  },
  clearSelections: () => {
    console.warn("Resource selections context is not set.")
  },
})

ResourceSelectionContext.displayName = "ResourceSelectionContext"

export function useResourceSelection(): ResourceSelectionContext {
  return useContext(ResourceSelectionContext)
}

export function ResourceSelectionProvider(
  props: PropsWithChildren<{ initialValuesForTesting?: Set<string> }>
) {
  const selections = props.initialValuesForTesting || new Set()
  const [selectedResources, setSelectedResources] = useState(selections)

  function isSelected(resourceName: string) {
    return selectedResources.has(resourceName)
  }

  // These will probably need to be converted to `setSelectedResources` calls
  function select(resourceName: string) {
    return selectedResources.add(resourceName)
  }

  function deselect(resourceName: string) {
    return selectedResources.delete(resourceName)
  }

  // Should this just be an array?
  function getSelections() {
    return Array.from(selectedResources.values())
  }

  function clearSelections() {
    setSelectedResources(new Set())
  }

  const contextValue: ResourceSelectionContext = {
    selected: selectedResources,
    isSelected,
    select,
    deselect,
    getSelections,
    clearSelections,
  }

  return (
    <ResourceSelectionContext.Provider value={contextValue}>
      {props.children}
    </ResourceSelectionContext.Provider>
  )
}