import { transition, style, animate, trigger, AnimationTriggerMetadata } from '@angular/animations';

export function inOutAnimation(time: string): AnimationTriggerMetadata {
    return trigger('inOutAnimation', [
      transition(
        ':enter',
        [
          style({opacity: 0, transform: "translateX(200px) scale(0.8)"}),
          animate(time + ' 200ms ease-out', style({opacity: 1, transform: "translateX(0) scale(1)"}))
        ]
      ),
      transition(
        ':leave',
        [
          animate(time + ' ease-in', style({opacity: 0, transform: "translateX(-200px) scale(0.8)"}))
        ]
      )
    ]);
  }