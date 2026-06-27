<script lang="ts">
  let { name = 'World' }: { name?: string } = $props();
</script>

<span data-framework="svelte">Hello {name} from Svelte</span>
