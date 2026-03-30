import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Bundle, HeadshotTip, Sensitivity } from "../backend";
import { Category, Rarity } from "../backend";
import { createActorWithConfig } from "../config";
import { useActor } from "./useActor";

export type { Bundle, Sensitivity, HeadshotTip };
export { Category, Rarity };

export function useBundles() {
  const { actor, isFetching } = useActor();
  return useQuery<Bundle[]>({
    queryKey: ["bundles"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getBundles();
    },
    enabled: !!actor && !isFetching,
    initialData: [],
  });
}

export function useSensitivities() {
  const { actor, isFetching } = useActor();
  return useQuery<Sensitivity[]>({
    queryKey: ["sensitivities"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSensitivities();
    },
    enabled: !!actor && !isFetching,
    initialData: [],
  });
}

export function useTips() {
  const { actor, isFetching } = useActor();
  return useQuery<HeadshotTip[]>({
    queryKey: ["tips"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTips();
    },
    enabled: !!actor && !isFetching,
    initialData: [],
  });
}

export function useStats() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      if (!actor)
        return { bundleCount: 0n, sensitivityCount: 0n, tipCount: 0n };
      return actor.getStats();
    },
    enabled: !!actor && !isFetching,
  });
}

async function getActor() {
  return createActorWithConfig();
}

export function useAddBundle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars: {
      name: string;
      description: string;
      imageUrl: string;
      rarity: Rarity;
    }) => {
      const a = await getActor();
      return a.addBundle(
        vars.name,
        vars.description,
        vars.imageUrl,
        vars.rarity,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["bundles"] }),
  });
}

export function useUpdateBundle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars: {
      id: bigint;
      name: string;
      description: string;
      imageUrl: string;
      rarity: Rarity;
    }) => {
      const a = await getActor();
      return a.updateBundle(
        vars.id,
        vars.name,
        vars.description,
        vars.imageUrl,
        vars.rarity,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["bundles"] }),
  });
}

export function useDeleteBundle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      const a = await getActor();
      return a.deleteBundle(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["bundles"] }),
  });
}

export function useAddSensitivity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars: {
      deviceLabel: string;
      general: bigint;
      redDot: bigint;
      scope2x: bigint;
      scope4x: bigint;
      awmScope: bigint;
      gyroscope: bigint;
    }) => {
      const a = await getActor();
      return a.addSensitivity(
        vars.deviceLabel,
        vars.general,
        vars.redDot,
        vars.scope2x,
        vars.scope4x,
        vars.awmScope,
        vars.gyroscope,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["sensitivities"] }),
  });
}

export function useUpdateSensitivity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars: {
      id: bigint;
      deviceLabel: string;
      general: bigint;
      redDot: bigint;
      scope2x: bigint;
      scope4x: bigint;
      awmScope: bigint;
      gyroscope: bigint;
    }) => {
      const a = await getActor();
      return a.updateSensitivity(
        vars.id,
        vars.deviceLabel,
        vars.general,
        vars.redDot,
        vars.scope2x,
        vars.scope4x,
        vars.awmScope,
        vars.gyroscope,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["sensitivities"] }),
  });
}

export function useDeleteSensitivity() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      const a = await getActor();
      return a.deleteSensitivity(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["sensitivities"] }),
  });
}

export function useAddTip() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars: {
      title: string;
      description: string;
      category: Category;
      displayOrder: bigint;
    }) => {
      const a = await getActor();
      return a.addTip(
        vars.title,
        vars.description,
        vars.category,
        vars.displayOrder,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tips"] }),
  });
}

export function useUpdateTip() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (vars: {
      id: bigint;
      title: string;
      description: string;
      category: Category;
      displayOrder: bigint;
    }) => {
      const a = await getActor();
      return a.updateTip(
        vars.id,
        vars.title,
        vars.description,
        vars.category,
        vars.displayOrder,
      );
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tips"] }),
  });
}

export function useDeleteTip() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      const a = await getActor();
      return a.deleteTip(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tips"] }),
  });
}
