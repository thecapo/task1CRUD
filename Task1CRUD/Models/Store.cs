using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Task1CRUD.Models
{
    public partial class Store
    {
        public Store()
        {
            Sales = new HashSet<Sales>();
        }

        public int Id { get; set; }

        [StringLength(30, MinimumLength = 2)]
        [Required(ErrorMessage = "Name is required")]
        public string Name { get; set; }

        [StringLength(100, MinimumLength = 2)]
        [Required(ErrorMessage = "Address is required")]
        public string Address { get; set; }

        public virtual ICollection<Sales> Sales { get; set; }
    }
}
