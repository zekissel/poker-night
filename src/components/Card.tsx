import { Card } from "../typedef";

interface CardProps {
    card: Card | undefined;
}

function CardImg ({ card }: CardProps) {

    let image = true;
    let rank = '';
    let suit = '';
    if (!card) image = false;
    else {
        switch(card.rank) {
            case 0: rank = 'Ace'; break; case 1: rank = 'Two'; break; case 2: rank = 'Three'; break; case 3: rank = 'Four'; break; 
            case 4: rank = 'Five'; break; case 5: rank = 'Six'; break; case 6: rank = 'Seven'; break; case 7: rank = 'Eight'; break; 
            case 8: rank = 'Nine'; break; case 9: rank = 'Ten'; break; case 10: rank = 'Jack'; break; case 11: rank = 'Queen'; break;
            case 12: rank = 'King'; break; 
        }
        switch(card.suit) {
            case 0: suit = 'Clubs'; break; case 1: suit = 'Diamonds'; break; case 2: suit = 'Hearts'; break; case 3: suit = 'Spades'; break; 
        }
    }

    return (
        <>
            {image ? <img src={`${card?.rank}_${card?.suit}.png`} alt={`${rank} of ${suit}`}/> : <></>}
        </>
    )
}

export default CardImg