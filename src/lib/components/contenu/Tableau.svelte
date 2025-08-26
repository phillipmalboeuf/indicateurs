<script lang="ts">
  import type { Entry } from 'contentful'
  import Document from '../document/Document.svelte'
  import type { TypeTableauSkeleton } from '$lib/clients/content_types'

  import { getLocale } from '$lib/paraglide/runtime'

  export let entry: Entry<TypeTableauSkeleton, "WITHOUT_UNRESOLVABLE_LINKS">

  let expanded = {}
</script>

<section id={entry.fields.id}>
  <div>
    <Document body={entry.fields.corps} />
  </div>

  <table>
    <tbody>
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
          <button onclick={() => expanded[i] = false}>{getLocale() === 'en' ? 'Read less' : 'En lire moins'}</button>
          {:else}
          <button onclick={() => expanded[i] = true}>{getLocale() === 'en' ? 'Read more' : 'En lire plus'}</button>
          {/if}
        </td>
      </tr>
      {/each}
    </tbody>
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
    // margin-left: -8vw;
    // max-width: calc(var(--width) / 2);

    @media (max-width: 888px) {
      margin-left: 0;
    }

    > div {
      max-width: calc(var(--width) / 1.5);
      margin-bottom: calc(var(--gutter) * 2);
    }
  }

  

  table {
    background: var(--dark);
    border: 1px solid white;
    border-collapse: collapse;

    @media (max-width: 888px) {
      display: block;
    }
    

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

      @media (max-width: 888px) {
        display: block;
        width: 100%;
      }
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