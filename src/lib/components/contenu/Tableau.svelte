<script lang="ts">
  import type { Entry, RichTextContent } from 'contentful'
  import Document from '../document/Document.svelte'
  import type { Lien } from '../Header.svelte'

  export let entry: Entry<{
    titre: string
    id: string
    corps: RichTextContent
    titreGauche: string
    titreDroite: string
    lignes: Entry<{
      id: string
      gauche: RichTextContent
      droite: RichTextContent
      lien: Entry<Lien>
    }>[]
  }>

  let expanded = {}
</script>

<section id={entry.fields.id}>
  <div>
    <Document body={entry.fields.corps} />
  </div>

  <table>
    <tr>
      <th>{entry.fields.titreGauche}</th>
      <th>{entry.fields.titreDroite}</th>
    </tr>
    {#each entry.fields.lignes as ligne, i}
    <tr id={ligne.fields.id}>
      <td>
        <Document body={ligne.fields.gauche} />

        {#if ligne.fields.lien}
        <a class="button" href={ligne.fields.lien.fields.lien} target={ligne.fields.lien.fields.externe && '_blank'}>{ligne.fields.lien.fields.titre}</a>
        {/if}
      </td>
      <td>
        <div class:expanded={expanded[i]}>
          <Document body={ligne.fields.droite} />
        </div>

        {#if expanded[i] === true}
        <button on:click={() => expanded[i] = false}>En lire moins</button>
        {:else}
        <button on:click={() => expanded[i] = true}>En lire plus</button>
        {/if}
      </td>
    </tr>
    {/each}
  </table>
  <!-- <ul>
    {#each entry.fields.items as item}
    <li>
      <h4>{item.fields.titre}</h4>
      <Document body={item.fields.corps} />
    </li>
    {/each}
  </ul> -->
  <!-- <hr> -->
</section>

<style lang="scss">
  section {
    margin-left: -16vw;
    // max-width: calc(var(--width) / 2);

    @media (max-width: 888px) {
      margin-left: 0;
    }
  }

  div {
    max-width: calc(var(--width) / 2);
    margin: 0 16vw calc(var(--gutter) * 2);

    @media (max-width: 888px) {
      margin: 0 0 calc(var(--gutter) * 2);
    }
  }

  table {
    background: var(--dark);
    border: 1px solid white;
    border-collapse: collapse;
    

    a.button {
      color: var(--dark);
      background: var(--light);
    }

    td,
    th {
      width: 50%;
      vertical-align: top;
      padding: 1em;
      border: 1px solid white;
    }

    th {
      text-align: left;
      font-weight: normal;
      color: var(--dark);
      background: var(--light);
      padding: 0.5em 1em;
    }

    td > div {
      position: relative;
      max-height: 5rem;
      overflow: hidden;
      margin-bottom: 0.5rem;

      &.expanded {
        max-height: none;
      }

      &:not(.expanded):after {
        content: "";
        pointer-events: none;
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 4rem;
        background: linear-gradient(0deg, var(--dark), fade-out(#1D1F27, 1));
      }
    }
  }
</style>