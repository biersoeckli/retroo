<script lang="ts">
  import { navigate } from "svelte-routing";
  import { AnonymousUserManager } from "../../business/anonymous-user-manager";
  import { RetroManager, retroNodeName } from "../../business/retro-manager";
  import { Database } from "../../data/database";
  import Loader from "../components/Loader.svelte";
  import type { Card } from "../../models/card";
  import type { Column } from "../../models/column";
  import RetroAddCard from "./components/RetroAddCard.svelte";
  import RetroCard from "./components/RetroCard.svelte";
  import Switch from "../components/ToggleSwitch.svelte";
  import { Loady } from "../../utils/loady";
import { SimpleOverlayModel } from "../../models/alert-model";
import SimpleOverlay from "../components/SimpleOverlay.svelte";
import RetroHeader from "./RetroHeader.svelte";

  interface ColumnExtended extends Column {
    data: Card[];
  }

  const retroManager = RetroManager.instance;
  const database = new Database();
  const urlParams = new URLSearchParams(window.location.search);
  const anonymousUserId = AnonymousUserManager.getUserId();

  $: columnClassName = "";
  $: extendedCols = [] as ColumnExtended[];
  initialize();
  async function initialize() {
    await Loady.on(async () => {
      if (!urlParams.has("id")) {
        navigate("/");
      }
      await retroManager.initializeAndListenWithSharedKey(
        urlParams.get("id"),
        (retro) => {
          columnClassName = `px-3 basis-full md:basis-1/${retroManager.retro.columns.length}`;
          extendedCols = toExtendedCols(retroManager.retro.columns);
          initializeCardListener();
        }
      );
      columnClassName = `px-3 basis-full md:basis-1/${retroManager.retro.columns.length}`;
    }, new SimpleOverlayModel("Oh no! 💩", "Sorry, we couldn't find the requested retroo board. Please verify that you are using the correct link.", ""));
  }

  let initializeCardListenerInitialized = false;
  async function initializeCardListener() {
    if (initializeCardListenerInitialized) {
      database.db
        .get(retroManager.retro.id)
        .get(retroNodeName)
        .get("cards")
        .map()
        .once(async (dbCard: Card, key: string) => {
          if (!dbCard) {
            return;
          }
          mapDataToColumn(await decodeCard(dbCard));
        });
      return;
    } else {
      initializeCardListenerInitialized = true;
      database.db
        .get(retroManager.retro.id)
        .get(retroNodeName)
        .get("cards")
        .map()
        .on(async (dbCard: Card, key: string) => {
          if (!dbCard) {
            return;
          }
          mapDataToColumn(await decodeCard(dbCard));
        });
    }
  }

  async function decodeCard(card: Card): Promise<Card> {
    const decodedCard = await retroManager.decodeData(card);
    if (!decodedCard) {
      return undefined;
    }
    if (
      decodedCard.createdBy !== anonymousUserId &&
      !retroManager.retro.showCardData
    ) {
      decodedCard.text = decodedCard.text
        ?.toString()
        ?.replace(/[^\n\r ]./g, "e");
    }
    return decodedCard;
  }

  function toExtendedCols(cols: Column[]): ColumnExtended[] {
    if (!cols) {
      return;
    }
    return cols.map((col) => {
      const colExtended = { ...col } as ColumnExtended;
      colExtended.data = [];
      return colExtended;
    });
  }

  function mapDataToColumn(card2Add: Card) {
    if (!card2Add) {
      return;
    }
    const columnWhereDataIsFor = extendedCols.find(
      (col) => col.id === card2Add.columnId
    );

    if (columnWhereDataIsFor) {
      const existingCard = columnWhereDataIsFor.data.find(
        (existCard) => card2Add.id === existCard.id
      );

      if (!existingCard || !card2Add.id) {
        // Sorts it by date
        insertCardInColumnCorrectOrder(columnWhereDataIsFor, card2Add);
      } else {
        existingCard.text = card2Add.text;
      }
    }
    // todo if column not found add in default column?
    extendedCols = extendedCols;
  }

  /**
   * Inserts a new Card into the Columns.data at the correct position.
   * Order of column.data is ascending by card.date.
   * @param column The column where the card will be added.
   * @param card2Add The card wich will be added.
   */
  function insertCardInColumnCorrectOrder(
    column: ColumnExtended,
    card2Add: Card
  ) {
    if (!column || !card2Add) {
      return;
    }

    if (!column.data || column.data.length === 0) {
      column.data = [card2Add];
      return;
    }

    const card2AddCreatedAt = new Date(card2Add?.createdAt ?? new Date());
    let cardWasAddedInbetween = false;
    for (let i = 0; i < column.data.length; i++) {
      const currentItemCreatedAt = new Date(
        column.data[i]?.createdAt ?? new Date()
      );
      if (currentItemCreatedAt.getTime() > card2AddCreatedAt.getTime()) {
        column.data.splice(i, 0, card2Add);
        cardWasAddedInbetween = true;
        break;
      }
    }

    if (!cardWasAddedInbetween) {
      column.data.push(card2Add);
    }
  }
</script>

{#if columnClassName}
  <RetroHeader />
  <div class="container mx-auto mt-10">
    <div class="flex flex-row">
      {#each extendedCols as col}
        <div class={columnClassName}>
          <div
            class={`rounded bg-slate-100 p-2 uppercase text-base text-slate-600 font-semibold`}
          >
            {col.name}
          </div>

          <RetroAddCard column={col} />

          {#each col.data as card}
            {#if card.text}
              <RetroCard
                {card}
                column={col}
                showCardData={retroManager.retro.showCardData ||
                  card.createdBy === anonymousUserId}
              />
            {/if}
          {/each}
        </div>
      {/each}
    </div>
  </div>
{/if}